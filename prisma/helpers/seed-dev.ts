import { populateSettingNames, populateUsers } from "./populate";


export const seedDev = async () => {
  // console.log('populating users...');
  // populateUsers();

  console.log('populating setting names...');
  populateSettingNames();

};

