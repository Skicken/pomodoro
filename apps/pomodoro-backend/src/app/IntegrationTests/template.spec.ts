import {
  TemplateService,
} from './../Modules/pomodoro/Services/Template/template.service';
import request from 'supertest';

import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PomodoroModule } from '../Modules/pomodoro/pomodoro.module';
import { config } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { Template, UserType } from '@prisma/client';
import { TokenPayload } from '../Modules/auth/Services/authenticate.service';
import { TemplateFilter } from '../Modules/pomodoro/Filters/TemplateFilter';
import { createApp } from './test-helper';
import { assert } from 'console';
import { AddTemplateDTO } from '../Modules/pomodoro/Dto/template/add-template-dto';

/**
 * @group int
 */

describe('Template Controller', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let templateService: TemplateService;

  let user_token: string;

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
  });
  describe('/GET template', () => {
    it(`get user default template`, async () => {
      const filter: TemplateFilter = { userID: 1 ,isDefault:true};
      const template: Template = (
        await request(app.getHttpServer())
          .get('/template/default')
          .query(filter)
          .set('Accept', 'application/json')
          .auth(user_token, { type: 'bearer' })
          .expect(200)
      ).body;

      expect(template.isDefault).toBe(true);
      expect(template.userID).toBe(filter.userID);
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

  describe('/DELETE template', () => {
    // it('non-default', async () => {
    //   const templates: Template[] =
    //     await templateService.GetTemplateFilter({ userID: 1 });
    //   assert(templates.length >= 2);

    //   const templateOne = templates.at(0);
    //   const templateTwo = templates.at(1);

    //   await request(app.getHttpServer())
    //     .delete(`/template/${templateOne.id}`)
    //     .auth(user_token, { type: 'bearer' })
    //     .expect(204);

    //   const mapTemplate: Template =
    //     await templateService.GetTemplate(templateTwo.id);

    //   expect(mapTemplate.template_SettingValue.length).toEqual(
    //     templateTwo.template_SettingValue.length
    //   );
    //   expect(hasDuplicateSetting(mapTemplate.template_SettingValue)).toBe(
    //     false
    //   );
    // });
    it('default', async () => {
      const templates: Template[] =
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
