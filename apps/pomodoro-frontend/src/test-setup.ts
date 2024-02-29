// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};
import 'jest-preset-angular/setup-jest';
import { ngMocks } from 'ng-mocks';

// auto spy
ngMocks.autoSpy('jest');

import { DefaultTitleStrategy, TitleStrategy } from '@angular/router';
import { MockService } from 'ng-mocks';
ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));

// Usually, *ngIf and other declarations from CommonModule aren't expected to be mocked.
// The code below keeps them.
import { CommonModule } from '@angular/common';
import { ApplicationModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
ngMocks.globalKeep(ApplicationModule, true);
ngMocks.globalKeep(CommonModule, true);
ngMocks.globalKeep(BrowserModule, true);

