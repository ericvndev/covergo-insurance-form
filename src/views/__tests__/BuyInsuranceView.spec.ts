import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { describe, expect, test } from 'vitest';
import BuyInsuranceView from '@/views/BuyInsuranceView.vue';
import type { GlobalMountOptions } from '@vue/test-utils/dist/types';

const mockRouter = createRouter({ history: createWebHistory(), routes: [] });

describe('Wizard step render test', () => {
	const wrapper = mount(BuyInsuranceView, {
		global: {
			plugins: [mockRouter],
		} as GlobalMountOptions,
	});
	test('step 0', async () => {
		wrapper.vm.step = 0;
		await flushPromises();
		expect(wrapper.text()).toContain('Hello There');
	});
	test('step 1', async () => {
		wrapper.vm.step = 1;
		await flushPromises();
		expect(wrapper.text()).toContain('Tell us about yourself');
	});
	test('step 2', async () => {
		wrapper.vm.formData = {
			name: 'Eric',
			age: 30,
			country: 'HKD',
			package: 'standard',
		};
		wrapper.vm.step = 2;
		await flushPromises();
		expect(wrapper.text()).toContain('Summary');
	});
	test('step 1 from route', async () => {
		const mockRouter = createRouter({
			history: createWebHistory(),
			routes: [],
		});
		mockRouter.currentRoute.value.query = {
			step: '1',
		};

		const wrapper = mount(BuyInsuranceView, {
			global: {
				plugins: [mockRouter],
			} as GlobalMountOptions,
		});
		await flushPromises();
		expect(wrapper.text()).toContain('Tell us about yourself');
	});
});

describe('Wizard navigation buttons test', () => {
	test('step 0 start button', async () => {
		const wrapper = mount(BuyInsuranceView, {
			global: {
				plugins: [mockRouter],
			} as GlobalMountOptions,
		});
		wrapper.vm.step = 0;
		await flushPromises();
		expect(wrapper.text()).toContain('Hello There');
		const buttons = wrapper.findAll('button');
		buttons[0].trigger('click');
		await flushPromises();
		expect(wrapper.text()).toContain('Tell us about yourself');
	});
	test('step 1 back button', async () => {
		const wrapper = mount(BuyInsuranceView, {
			global: {
				plugins: [mockRouter],
			} as GlobalMountOptions,
		});
		wrapper.vm.step = 1;
		await flushPromises();
		expect(wrapper.text()).toContain('Tell us about yourself');
		const buttons = wrapper.findAll('button');
		buttons[0].trigger('click');
		await flushPromises();
		expect(wrapper.text()).toContain('Hello There');
	});
	test('step 1 next button', async () => {
		const wrapper = mount(BuyInsuranceView, {
			global: {
				plugins: [mockRouter],
			} as GlobalMountOptions,
		});
		wrapper.vm.step = 1;
		wrapper.vm.formData = {
			name: 'Eric',
			age: 30,
			country: 'HKD',
			package: 'standard',
		};
		await flushPromises();
		expect(wrapper.text()).toContain('Tell us about yourself');
		expect(wrapper.vm.finalPremium).toBe(300);
		const buttons = wrapper.findAll('button');
		buttons[1].trigger('click');
		await flushPromises();
		expect(wrapper.text()).toContain('Summary');
	});
	test('step 2 back button', async () => {
		const wrapper = mount(BuyInsuranceView, {
			global: {
				plugins: [mockRouter],
			} as GlobalMountOptions,
		});
		wrapper.vm.formData = {
			name: 'Eric',
			age: 30,
			country: 'HKD',
			package: 'standard',
		};
		wrapper.vm.step = 2;
		await flushPromises();
		expect(wrapper.text()).toContain('Summary');
		const buttons = wrapper.findAll('button');
		buttons[0].trigger('click');
		await flushPromises();
		expect(wrapper.text()).toContain('Tell us about yourself');
	});
	test('step 2 buy button', async () => {
		const wrapper = mount(BuyInsuranceView, {
			global: {
				plugins: [mockRouter],
			} as GlobalMountOptions,
		});
		wrapper.vm.formData = {
			name: 'Eric',
			age: 30,
			country: 'HKD',
			package: 'standard',
		};
		wrapper.vm.step = 2;
		await flushPromises();
		expect(wrapper.text()).toContain('Summary');
		const buttons = wrapper.findAll('button');
		buttons[1].trigger('click');
		await flushPromises();
		expect(wrapper.text()).toContain('Hello There');
	});
});

describe('Calculate Standard Premium', () => {
	const wrapper = mount(BuyInsuranceView, {
		global: {
			plugins: [mockRouter],
		} as GlobalMountOptions,
	});
	test('with rate 1 (HK)', () => {
		wrapper.vm.formData = {
			name: 'Eric',
			age: 30,
			country: 'HKD',
			package: 'standard',
		};
		expect(wrapper.vm.calculateStandardPremium()).toBe(30 * 10 * 1);
	});
	test('with rate 3 (Australia)', () => {
		wrapper.vm.formData = {
			name: 'Eric',
			age: 30,
			country: 'AUD',
			package: 'standard',
		};
		expect(wrapper.vm.calculateStandardPremium()).toBe(30 * 10 * 3);
	});
	test('with invalid age', () => {
		wrapper.vm.formData = {
			name: 'Eric',
			age: -2,
			country: 'HKD',
			package: 'standard',
		};
		expect(wrapper.vm.calculateStandardPremium()).toBe(0);
	});
	test('with invalid country', () => {
		wrapper.vm.formData = {
			name: 'Eric',
			age: -2,
			country: 'HKDD',
			package: 'standard',
		};
		expect(wrapper.vm.calculateStandardPremium()).toBe(0);
	});
	test('with invalid package', () => {
		wrapper.vm.formData = {
			name: 'Eric',
			age: -2,
			country: 'HKD',
			package: 'test',
		};
		expect(wrapper.vm.calculateStandardPremium()).toBe(0);
	});
});

describe('Calculate Final Premium', () => {
	const wrapper = mount(BuyInsuranceView, {
		global: {
			plugins: [mockRouter],
		} as GlobalMountOptions,
	});
	test('safe with rate 1 (HK)', () => {
		wrapper.vm.formData = {
			name: 'Eric',
			age: 30,
			country: 'HKD',
			package: 'safe',
		};
		expect(wrapper.vm.finalPremium).toBe(30 * 10 * 1 + 150);
	});
	test('safe with rate 3 (Australia)', () => {
		wrapper.vm.formData = {
			name: 'Eric',
			age: 30,
			country: 'AUD',
			package: 'safe',
		};
		expect(wrapper.vm.finalPremium).toBe(30 * 10 * 3 + 450);
	});
	test('super safe with rate 1 (HK)', () => {
		wrapper.vm.formData = {
			name: 'Eric',
			age: 30,
			country: 'HKD',
			package: 'super-safe',
		};
		expect(wrapper.vm.finalPremium).toBe(30 * 10 * 1 + 225);
	});
	test('super safe with rate 3 (HK)', () => {
		wrapper.vm.formData = {
			name: 'Eric',
			age: 30,
			country: 'AUD',
			package: 'super-safe',
		};
		expect(wrapper.vm.finalPremium).toBe(30 * 10 * 3 + 675);
	});
});

describe('Test age validation', () => {
	const wrapper = mount(BuyInsuranceView, {
		global: {
			plugins: [mockRouter],
		} as GlobalMountOptions,
	});
	test('age over 100', async () => {
		wrapper.vm.step = 1;
		wrapper.vm.formData = {
			name: 'Eric',
			age: 102,
			country: 'HKD',
			package: 'standard',
		};
		expect(wrapper.text()).toContain('Hello There');
		wrapper.vm.step = 2;
		await flushPromises();
		expect(wrapper.text()).toContain('Oops');
	});
});
