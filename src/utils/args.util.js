import {Command} from 'commander';

const args = new Command();

args.option('--env <env>', 'Environment', 'prod');
args.option('--persistence <persistence>', 'Persistence', ',mongo');
args.option('-u <user>', 'User', 'user');

args.parse();

export default args.opts();