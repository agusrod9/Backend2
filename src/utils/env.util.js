import { config } from 'dotenv';
import argsUtil from './args.util.js';

const {env} = argsUtil;

const path = `./.env.${env}`;
config({path});

const envUtil = {
    API_BASE_URL : process.env.API_BASE_URL,
    COOKIES_SECRET : process.env.COOKIES_SECRET,
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
    MONGO_LOCAL_URI : process.env.MONGO_LOCAL_URI, 
    MONGO_REMOTE_URI : process.env.MONGO_REMOTE_URI,
    PORT : process.env.PORT,
    SESSION_SECRET : process.env.SESSION_SECRET,
    TOKEN_SECRET : process.env.TOKEN_SECRET
};

export default envUtil;