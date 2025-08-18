import moment from 'moment';

export const ENV_TYPE = {
  development: "development",
  production: "production"
};

export const NODE_ENV = process.env.NODE_ENV || ENV_TYPE.development;
export const PORT = process.env.PORT || 8087;
export const HTTPS_DISABLED = !!process.env.HTTPS_DISABLED;
export const PRIVATE_KEY = process.env.PRIVATE_KEY || '../key.pem';
export const PUBLIC_KEY = process.env.PUBLIC_KEY || '../server.crt';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'https://localhost:4200';

// MySQL Database Configuration
export const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
export const MYSQL_PORT = process.env.MYSQL_PORT || 3306;
export const MYSQL_USERNAME = process.env.MYSQL_USERNAME || 'root';
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'password';
export const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'boilerplate';
export const MYSQL_DIALECT = process.env.MYSQL_DIALECT || 'mysql';

export const POST_ADDRESS = process.env.POST_ADDRESS || 'EMAIL';
export const POST_SERVICE = process.env.POST_SERVICE || 'gmail';
export const POST_PASSWORD = process.env.POST_PASSWORD || 'PASSWORD';
export const POST_SENDER_TITLE = process.env.POST_SENDER_TITLE || 'PRO FORWARD';

export const DEFAULT_ADMINISTRATOR_NAME = 'admin';
export const DEFAULT_ADMINISTRATOR_PASSWORD = 'Zaqwsx321';

export const SCHEDULER = {
  TRIAL_PERIOD_CHECK_INTERVAL_IN_MINUTES: process.env.TRIAL_PERIOD_CHECK_INTERVAL_IN_MINUTES || '10',
  REMINDER_USER_CHECK_INTERVAL_IN_MINUTES: process.env.REMINDER_USER_CHECK_INTERVAL_IN_MINUTES || '10'
};

export const AWS = {
  ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'AKIAJQV4F6L3OKVG4BBA',
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '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',
  BUCKET_NAME: process.env.AWS_BUCKET_NAME || 'mateam_crm'
};

export const TRIAL_PERIOD_INTERVAL_IN_MS = process.env.TRIAL_PERIOD_INTERVAL_IN_MS || moment.duration({
  seconds: 0,
  minutes: 0,
  hours: 0,
  days: 0,
  weeks: 0,
  months: 1,
  years: 0
}).asMilliseconds();