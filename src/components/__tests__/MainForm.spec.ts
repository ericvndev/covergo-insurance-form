import { mount, flushPromises } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';

import MainForm from '@/components/MainForm.vue';

import type ServerData from '@/types/ServerData';

const dataFromServer: ServerData = {
	countries: [
		{
			name: 'Hong Kong',
			currencyCode: 'HKD',
			exchangeRate: 1,
		},
		{
			name: 'USA',
			currencyCode: 'USD',
			exchangeRate: 2,
		},
		{
			name: 'Australia',
			currencyCode: 'AUD',
			exchangeRate: 3,
		},
	],
	packages: [
		{
			id: 'standard',
			name: 'Standard',
			extraPercent: 0,
		},
		{
			id: 'safe',
			name: 'Safe',
			extraPercent: 50,
		},
		{
			id: 'super-safe',
			name: 'Super Safe',
			extraPercent: 75,
		},
	],
};
describe('Form validation', () => {
	test('required fields no Error', () => {
		const wrapper = mount(MainForm, {
			props: {
				data: {
					name: 'Eric',
					age: 30,
					country: 'HKD',
					package: 'standard',
				},
				serverData: dataFromServer,
				standardPremium: 0,
				finalPremium: 0,
			},
		});
		expect(wrapper.vm.validationErrors).toEqual({
			hasErrors: false,
			name: '',
			age: '',
			country: '',
		});
	});
	test('required field name', () => {
		const wrapper = mount(MainForm, {
			props: {
				data: {
					name: '',
					age: 30,
					country: 'HKD',
					package: 'standard',
				},
				serverData: dataFromServer,
				standardPremium: 0,
				finalPremium: 0,
			},
		});
		expect(wrapper.vm.validationErrors).toEqual({
			hasErrors: true,
			name: 'This field is required',
			age: '',
			country: '',
		});
	});
	test('required field age', () => {
		const wrapper = mount(MainForm, {
			props: {
				data: {
					name: 'Eric',
					age: null,
					country: 'HKD',
					package: 'standard',
				},
				serverData: dataFromServer,
				standardPremium: 0,
				finalPremium: 0,
			},
		});
		expect(wrapper.vm.validationErrors).toEqual({
			hasErrors: true,
			name: '',
			age: 'This field is required',
			country: '',
		});
	});
	test('required field country', () => {
		const wrapper = mount(MainForm, {
			props: {
				data: {
					name: 'Eric',
					age: 30,
					country: '',
					package: 'standard',
				},
				serverData: dataFromServer,
				standardPremium: 0,
				finalPremium: 0,
			},
		});
		expect(wrapper.vm.validationErrors).toEqual({
			hasErrors: true,
			name: '',
			age: '',
			country: 'This field is required',
		});
	});
	test('required both name and age', () => {
		const wrapper = mount(MainForm, {
			props: {
				data: {
					name: '',
					age: null,
					country: 'HKD',
					package: 'standard',
				},
				serverData: dataFromServer,
				standardPremium: 0,
				finalPremium: 0,
			},
		});
		expect(wrapper.vm.validationErrors).toEqual({
			hasErrors: true,
			name: 'This field is required',
			age: 'This field is required',
			country: '',
		});
	});
	test('invalid age (number but < 0)', () => {
		const wrapper = mount(MainForm, {
			props: {
				data: {
					name: 'Eric',
					age: -30,
					country: 'HKD',
					package: 'standard',
				},
				serverData: dataFromServer,
				standardPremium: 0,
				finalPremium: 0,
			},
		});
		expect(wrapper.vm.validationErrors).toEqual({
			hasErrors: true,
			name: '',
			age: 'Not a valid age',
			country: '',
		});
	});
	test('invalid age (not a number)', () => {
		const wrapper = mount(MainForm, {
			props: {
				data: {
					name: 'Eric',
					age: 'test',
					country: 'HKD',
					package: 'standard',
				},
				serverData: dataFromServer,
				standardPremium: 0,
				finalPremium: 0,
			},
		});
		expect(wrapper.vm.validationErrors).toEqual({
			hasErrors: true,
			name: '',
			age: 'Not a valid age',
			country: '',
		});
	});
});

describe('Form show errors', () => {
	test('show required field name', async () => {
		const wrapper = mount(MainForm, {
			props: {
				data: {
					name: '',
					age: 30,
					country: 'HKD',
					package: 'standard',
				},
				serverData: dataFromServer,
				standardPremium: 0,
				finalPremium: 0,
			},
		});
		wrapper.vm.handleClickNext();
		await flushPromises();
		const error = wrapper.find('.error');
		expect(error.text()).toBe('This field is required');
	});
	test('show required field age', async () => {
		const wrapper = mount(MainForm, {
			props: {
				data: {
					name: 'Eric',
					age: null,
					country: 'HKD',
					package: 'standard',
				},
				serverData: dataFromServer,
				standardPremium: 0,
				finalPremium: 0,
			},
		});
		wrapper.vm.handleClickNext();
		await flushPromises();
		const error = wrapper.find('.error');
		expect(error.text()).toBe('This field is required');
	});
	test('show invalid field age', async () => {
		const wrapper = mount(MainForm, {
			props: {
				data: {
					name: 'Eric',
					age: -39,
					country: 'HKD',
					package: 'standard',
				},
				serverData: dataFromServer,
				standardPremium: 0,
				finalPremium: 0,
			},
		});
		wrapper.vm.handleClickNext();
		await flushPromises();
		const error = wrapper.find('.error');
		expect(error.text()).toBe('Not a valid age');
	});
});
