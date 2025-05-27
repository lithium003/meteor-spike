import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import { TasksCollection } from '/imports/api/tasks';
import { onPageLoad } from 'meteor/server-render';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from '/imports/ui/App.jsx';

onPageLoad(async sink => {
  const initialTasks = await TasksCollection.find().fetch();
  const html = renderToString(<App tasks={initialTasks} />);
  sink.renderIntoElementById('react-target', html);
  sink.appendToHead(`
  <script>
    window.__INITIAL_TASKS__ = ${JSON.stringify(initialTasks)}
  </script>
  `);
});

WebApp.handlers.use("/hello", (req, res, next) => {
  Assets.getTextAsync('hello.html', (err, html) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
  });
});

async function insertLink({ title, url }) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}
const insertTask = ( task ) => TasksCollection.insertAsync(task);

Meteor.startup(async () => {
  TasksCollection.rawCollection().drop();
  if ((await TasksCollection.find().countAsync()) === 0) {
    [
      { text: "1st Task", tag: "A" },
      { text: "2nd Task", tag: "A" },
      { text: "3rd Task", tag: "C" },
      { text: "4th Task", tag: "B" },
      { text: "5th Task", tag: "C" }
    ].forEach(insertTask);
  }
  Meteor.publish("tasks", _ => TasksCollection.find());

  // If the Links collection is empty, add some data.
  if (await LinksCollection.find().countAsync() === 0) {
    await insertLink({
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/tutorials/react/creating-an-app',
    });

    await insertLink({
      title: 'Follow the Guide',
      url: 'https://guide.meteor.com',
    });

    await insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com',
    });

    await insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com',
    });
  }

  // We publish the entire Links collection to all clients.
  // In order to be fetched in real-time to the clients
  Meteor.publish("links", function () {
    return LinksCollection.find();
  });
});
