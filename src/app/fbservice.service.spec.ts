import { TestBed } from '@angular/core/testing';

import { FBserviceService } from './fbservice.service';

describe('FBserviceService', () => {
  let service: FBserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FBserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
