const { MongoClient } = require('mongodb');
MongoClient.connect('mongodb://pyratin:didi1234@ac-6dl3ehk-shard-00-00.9mbvglo.mongodb.net:27017/lwd?ssl=true&replicaSet=atlas-drrhrz-shard-0&authSource=admin', { useUnifiedTopology: true }, (err, client) => {
  if (err) { console.error(err); process.exit(1); }
  const db = client.db('lwd');
  db.collection('decks').findOne({ 'splash.title': 'The Matrix' }, (err2, deck) => {
    if (deck === null) { console.log('No deck found'); client.close(); process.exit(0); return; }
    console.log('Splash characters:');
    (deck.splash.characters || []).forEach((c, i) => {
      console.log('  ' + i + ': role=' + c.role + ' text=' + c.text + ' actorImageId=' + (c.actorImageId || 'NONE') + ' profileImage=' + (c.profileImage ? 'yes' : 'no'));
    });
    console.log('Cards with actorImageId:');
    (deck.cards || []).forEach((c, i) => {
      if (c.actorImageId) console.log('  card ' + i + ': actorImageId=' + c.actorImageId);
    });
    console.log('Total cards:', deck.cards.length);
    client.close();
    process.exit(0);
  });
});
