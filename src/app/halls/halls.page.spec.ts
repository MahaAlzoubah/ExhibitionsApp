import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HallsPage } from './halls.page';

describe('HallsPage', () => {
  let component: HallsPage;
  let fixture: ComponentFixture<HallsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HallsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
