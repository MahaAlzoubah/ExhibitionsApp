import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HallsDetailsPage } from './halls-details.page';

describe('HallsDetailsPage', () => {
  let component: HallsDetailsPage;
  let fixture: ComponentFixture<HallsDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HallsDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
