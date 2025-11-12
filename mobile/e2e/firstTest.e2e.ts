describe('BabyNames onboarding', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true
    });
  });

  it('shows the login screen', async () => {
    await expect(element(by.text('Welcome back'))).toBeVisible();
  });
});
