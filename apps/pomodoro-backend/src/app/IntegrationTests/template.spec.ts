import {
  TemplateService,
  TemplateWithSettings,
} from './../Modules/pomodoro/Services/Template/template.service';
import request from 'supertest';

import { Test } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { PomodoroModule } from '../Modules/pomodoro/pomodoro.module';
import { config } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { Template, UserType } from '@prisma/client';
import { TokenPayload } from '../Modules/auth/Services/authenticate.service';
import { TemplateFilter } from '../Modules/pomodoro/Filters/TemplateFilter';
import { AddTemplateDTO } from '../Modules/pomodoro/Dto/add-template-dto';
import { createApp, hasDuplicateSetting } from './test-helper';
import { MapSettingDTO } from '../Modules/pomodoro/Dto/map-setting-dto';
import { assert } from 'console';

describe('Template Controller', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let templateService: TemplateService;

  let user_token: string;
  let admin_token: string;

  beforeAll(async () => {
    config({ path: 'apps/pomodoro-backend/.env' });
    const moduleRef = await Test.createTestingModule({
      imports: [PomodoroModule],
    }).compile();

    app = createApp(moduleRef);
    await app.init();

    jwtService = moduleRef.get(JwtService);
    templateService = moduleRef.get(TemplateService);
    user_token = jwtService.sign(<TokenPayload>{ sub: 1, role: UserType.USER });
    admin_token = jwtService.sign(<TokenPayload>{
      sub: 1,
      role: UserType.ADMIN,
    });
  });
  describe('/GET template', () => {
    it(`get user default template`, async () => {
      const filter: TemplateFilter = { userID: 1 ,isDefault:true};
      const template: TemplateWithSettings = (
        await request(app.getHttpServer())
          .get('/template/default')
          .query(filter)
          .set('Accept', 'application/json')
          .auth(user_token, { type: 'bearer' })
          .expect(200)
      ).body;

      expect(template.isDefault).toBe(true);
      expect(template.userID).toBe(filter.userID);
      expect(template.template_SettingValue.length).toBeGreaterThan(0);
      expect(hasDuplicateSetting(template.template_SettingValue)).toBe(false);
    });
    it(`invalid query`, async () => {
      const filter: TemplateFilter = {};
      return request(app.getHttpServer())
        .get('/template')
        .query(filter)
        .set('Accept', 'application/json')
        .auth(user_token, { type: 'bearer' })
        .expect(400);
    });
    it(`unauthorized`, async () => {
      const filter: TemplateFilter = { userID: 1 };
      return request(app.getHttpServer())
        .get('/template')
        .query(filter)
        .set('Accept', 'application/json')
        .expect(401);
    });

    it(`Not owning template`, async () => {
      const filter: TemplateFilter = {};
      const notOwnedTemplate: Template[] =
        await templateService.GetTemplateFilter({ userID: 2 });
      assert(notOwnedTemplate.length > 0);
      return request(app.getHttpServer())
        .get(`/template/${notOwnedTemplate.at(0).id}`)
        .query(filter)
        .auth(user_token, { type: 'bearer' })
        .set('Accept', 'application/json')
        .expect(403);
    });

    it(`Not existing`, async () => {
      const filter: TemplateFilter = {};
      return request(app.getHttpServer())
        .get('/template/100')
        .query(filter)
        .auth(user_token, { type: 'bearer' })

        .set('Accept', 'application/json')
        .expect(404);
    });
  });
  describe('/POST template', () => {
    it(`with valid data`, async () => {
      const data: AddTemplateDTO = {
        templateName: 'Simple Template',
      };
      const template: Template = (
        await request(app.getHttpServer())
          .post('/template')
          .send(data)
          .auth(user_token, { type: 'bearer' })
          .expect(201)
      ).body;

      expect(template.isDefault).toBe(false);
      expect(template.userID).toBe(1);
    });
    it(`unauthorized`, async () => {
      const filter: TemplateFilter = {};
      return request(app.getHttpServer())
        .get('/template')
        .query(filter)
        .set('Accept', 'application/json')
        .expect(401);
    });
    it(`with empty data`, async () => {
      return request(app.getHttpServer())
        .post('/template')
        .auth(user_token, { type: 'bearer' })
        .expect(400);
    });
  });
  describe('/PUT template', () => {
    it(` from one template to another`, async () => {
      const templates: TemplateWithSettings[] =
        await templateService.GetTemplateFilter({ userID: 1,isDefault:false });
      assert(templates.length >= 2);

      const templateOne = templates.at(0);
      const templateTwo = templates.at(1);
      const mapping: MapSettingDTO = {
        from: templateOne.template_SettingValue.at(0).id,
        to: templateTwo.template_SettingValue.at(0).id,
      };

      const template: TemplateWithSettings = (
        await request(app.getHttpServer())
          .put(`/template/${templateOne.id}`)
          .send(mapping)
          .auth(user_token, { type: 'bearer' })
          .expect(200)
      ).body;
      expect(template.template_SettingValue.length).toEqual(
        templateOne.template_SettingValue.length
      );
      const hasMappedSetting = template.template_SettingValue.find((value)=> {return value.id == templateTwo.template_SettingValue.at(0).id})
      expect(hasMappedSetting).toBeDefined();
    });
    it(`to self`, async () => {
      const templates: TemplateWithSettings[] =
        await templateService.GetTemplateFilter({ userID: 1 });
      assert(templates.length >= 2);
      const templateOne = templates.at(0);
      const mapping: MapSettingDTO = {
        from: templateOne.template_SettingValue.at(0).id,
        to: templateOne.template_SettingValue.at(0).id,
      };

      const template: TemplateWithSettings = (
        await request(app.getHttpServer())
        .put(`/template/${templateOne.id}`)
        .send(mapping)
          .auth(user_token, { type: 'bearer' })
          .expect(200)
      ).body;

      expect(template.template_SettingValue.length).toEqual(
        templateOne.template_SettingValue.length
      );
      const hasMappedSetting = template.template_SettingValue.find((value)=> {return value.id == templateOne.template_SettingValue.at(0).id})
      expect(hasMappedSetting).toBeDefined();
    });
    it(`unauthorized`, async () => {
      const templates: TemplateWithSettings[] =
        await templateService.GetTemplateFilter({ userID: 1 });
      assert(templates.length >= 2);

      const templateOne = templates.at(0);
      const mapping: MapSettingDTO = {
        from: templateOne.template_SettingValue.at(0).id,
        to: templateOne.template_SettingValue.at(0).id,
      };
      await request(app.getHttpServer())
      .put(`/template/${templateOne.id}`)
      .send(mapping)
        .expect(401);
    });
    it(`Not owning template`, async () => {
      const templates: TemplateWithSettings[] =
        await templateService.GetTemplateFilter({ userID: 2,isDefault:false });
      assert(templates.length >= 2);

      const templateOne = templates.at(0);
      const templateTwo = templates.at(1);

      const mapping: MapSettingDTO = {
        from: templateOne.template_SettingValue.at(0).id,
        to: templateTwo.template_SettingValue.at(0).id,
      };

      await request(app.getHttpServer())
      .put(`/template/${templateOne.id}`)
      .send(mapping)
        .auth(user_token, { type: 'bearer' })
        .expect(403);
    });
    it(`Mapping two different keys`, async () => {
      const templates: TemplateWithSettings[] =
        await templateService.GetTemplateFilter({ userID: 1,isDefault:false});
        expect(templates.length >= 2);
      const templateOne = templates.at(0);
      const templateTwo = templates.at(1);

      const mapping: MapSettingDTO = {
        from: templateOne.template_SettingValue.at(0).id,
        to: templateTwo.template_SettingValue.at(5).id,
      };
      expect(templateOne.template_SettingValue.at(0).settingNameID!=templateTwo.template_SettingValue.at(5).settingNameID)

      await request(app.getHttpServer())
      .put(`/template/${templateOne.id}`)
      .send(mapping)
        .auth(user_token, { type: 'bearer' })
        .expect(400);
    });
    it(`Mapping to non existing template`, async () => {
      const templates: TemplateWithSettings[] =
        await templateService.GetTemplateFilter({ userID: 1 });
      assert(templates.length >= 2);
      const templateOne = templates.at(0);
      const templateTwo = templates.at(1);

      const mapping: MapSettingDTO = {
        from: templateOne.template_SettingValue.at(0).id,
        to: templateTwo.template_SettingValue.at(1).id,
      };

      await request(app.getHttpServer())
        .put(`/template/9999`)
        .send(mapping)
        .auth(user_token, { type: 'bearer' })
        .expect(404);
    });
    it(`Mapping non existing from setting`, async () => {
      const templates: TemplateWithSettings[] =
        await templateService.GetTemplateFilter({ userID: 1 });
      assert(templates.length >= 2);
      const templateOne = templates.at(0);
      const templateTwo = templates.at(1);

      const mapping: MapSettingDTO = {
        from: templateOne.template_SettingValue.at(0).id,
        to: 999,
      };

      await request(app.getHttpServer())
        .put(`/template/100`)
        .send(mapping)
        .auth(user_token, { type: 'bearer' })
        .expect(404);
    });
    it(`Mapping non existing to setting`, async () => {
      const templates: TemplateWithSettings[] =
        await templateService.GetTemplateFilter({ userID: 1 });
      assert(templates.length >= 2);
      const templateOne = templates.at(0);
      const templateTwo = templates.at(1);

      const mapping: MapSettingDTO = {
        from: 999,
        to: templateTwo.template_SettingValue.at(0).id,
      };

      await request(app.getHttpServer())
        .put(`/template/${templateOne.id}`)
        .send(mapping)
        .auth(user_token, { type: 'bearer' })
        .expect(404);
    });
    it(`Mapping invalid data format`, async () => {
      const templates: TemplateWithSettings[] =
        await templateService.GetTemplateFilter({ userID: 1 });
      assert(templates.length >= 2);
      const templateOne = templates.at(0);

      const mapping = {
        from: 'wt1sdf2wy3',
        to: 'asdf123',
      };
      await request(app.getHttpServer())
      .put(`/template/${templateOne.id}`)
      .send(mapping)
        .auth(user_token, { type: 'bearer' })
        .expect(400);
    });
  });
  describe('/DELETE template', () => {
    // it('non-default', async () => {
    //   const templates: TemplateWithSettings[] =
    //     await templateService.GetTemplateFilter({ userID: 1 });
    //   assert(templates.length >= 2);

    //   const templateOne = templates.at(0);
    //   const templateTwo = templates.at(1);

    //   await request(app.getHttpServer())
    //     .delete(`/template/${templateOne.id}`)
    //     .auth(user_token, { type: 'bearer' })
    //     .expect(204);

    //   const mapTemplate: TemplateWithSettings =
    //     await templateService.GetTemplate(templateTwo.id);

    //   expect(mapTemplate.template_SettingValue.length).toEqual(
    //     templateTwo.template_SettingValue.length
    //   );
    //   expect(hasDuplicateSetting(mapTemplate.template_SettingValue)).toBe(
    //     false
    //   );
    // });
    it('default', async () => {
      const templates: TemplateWithSettings[] =
        await templateService.GetTemplateFilter({ userID: 1,isDefault:true });

      const templateOne = templates.at(0);

      await request(app.getHttpServer())
        .delete(`/template/${templateOne.id}`)
        .auth(user_token, { type: 'bearer' })
        .expect(400);

    });
  });
  afterAll(async () => {
    await app.close();
  });
});
