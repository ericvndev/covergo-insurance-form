import type Country from './Country';
import type InsurancePackage from './InsurancePackage';

export default interface ServerData {
	countries: Array<Country>;
	packages: Array<InsurancePackage>;
}
