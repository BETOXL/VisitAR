import { TestBed } from '@angular/core/testing';

import { ApiVisitArService } from './api-visit-ar.service';

describe('ApiVisitArService', () => {
  let service: ApiVisitArService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiVisitArService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
