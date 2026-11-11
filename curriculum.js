// ENGLISH QUEST — COMPLETE CEFR CURRICULUM v2
(function(){
  const data = window.ENGLISH_QUEST_CURRICULUM;
  if (!data || data.version !== 2) return;
  const vocabKey = "english-quest-vocabulary";
  const testKey = "english-quest-tests";
  try {
    let vocab = JSON.parse(localStorage.getItem(vocabKey) || "[]");
    if (!Array.isArray(vocab)) vocab = [];
    const oldVocab = new Set(data.replaceVocabularyIds.map(Number));
    vocab = vocab.filter(x => !oldVocab.has(Number(x.id)) && !data.vocabulary.some(n => Number(n.id)===Number(x.id)));
    const freshVocab = data.vocabulary.map(set => ({
      id:set.id, title:set.title,
      words:set.words.map(w=>({word:w[0],translation:w[1],example:w[2],image:(typeof vocabularyEmojiImage==='function'?vocabularyEmojiImage(w[3]):''),emoji:w[3]}))
    }));
    localStorage.setItem(vocabKey, JSON.stringify([...vocab,...freshVocab]));
    if (typeof vocabularySets !== 'undefined') { vocabularySets=[...vocab,...freshVocab]; if(typeof renderVocabularySets==='function') renderVocabularySets(); }
  } catch(e){ console.error('Curriculum vocabulary install failed:',e); }
  try {
    let tests = JSON.parse(localStorage.getItem(testKey) || "[]");
    if (!Array.isArray(tests)) tests=[];
    const oldTestIds = new Set(data.replaceTestIds.map(Number));
    const newIds = new Set(data.tests.map(x=>Number(x.id)));
    tests = tests.filter(t=>!oldTestIds.has(Number(t.id)) && !newIds.has(Number(t.id)));
    const freshTests = data.tests.map(t=>({id:t.id,title:t.title,questions:t.questions.map(q=>({...q,answers:[...q.answers]}))}));
    localStorage.setItem(testKey,JSON.stringify([...tests,...freshTests]));
    tests = [...tests,...freshTests];
    if (typeof saveData==='function') saveData();
    if (typeof renderTests==='function') renderTests();
    if (typeof renderPlayTests==='function') renderPlayTests();
  } catch(e){ console.error('Curriculum tests install failed:',e); }
  console.info('English Quest CEFR curriculum v2 installed: 400 words, 20 tests, 400 questions.');
})();
