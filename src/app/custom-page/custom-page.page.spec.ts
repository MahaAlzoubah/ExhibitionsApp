import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomPagePage } from './custom-page.page';

describe('CustomPagePage', () => {
  let component: CustomPagePage;
  let fixture: ComponentFixture<CustomPagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CustomPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
