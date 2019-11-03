import SkillHandler from './modules/orva@core/lib/skill-handler';

SkillHandler.handleSkill(['who is my dad'], (req, err) => {
  return 'your dad';
});

SkillHandler.handleSkill(['who is my mom'], (req, err) => {
  return 'your mom';
});

SkillHandler.handleSkill(['who are you', 'what are you'], (req, err) => {
  return 'i am you';
});

const port = 3000;
SkillHandler.start(port);


// import {dictionaryApi} from './modules/orva@core/lib/handler';

// const test = async () => {
//   const {data}= await dictionaryApi.getInfo('cat');
//   console.log(data.filter((x) => x.fl === 'noun')[0].meta.syns[0]);
// };

// test();
