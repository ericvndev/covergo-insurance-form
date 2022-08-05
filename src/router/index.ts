import { createRouter, createWebHistory } from 'vue-router';
import BuyInsurance from '../views/BuyInsuranceView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			redirect: '/buy-insurance',
		},
		{
			path: '/buy-insurance',
			name: 'buy-insurance',
			component: BuyInsurance,
		},
	],
});

export default router;
