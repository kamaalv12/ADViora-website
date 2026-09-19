// Centralized model registration
// Importing this file ensures all Mongoose models are registered in the global mongoose instance.

import './User';
import './UtmCampaign';
import './ServiceEnquiry';

export { default as User } from './User';
export { default as UtmCampaign } from './UtmCampaign';
export { default as ServiceEnquiry } from './ServiceEnquiry';
