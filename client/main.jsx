import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { App } from '/imports/ui/App';
import { hydrateRoot } from 'react-dom/client'

Meteor.startup(() => {
  const container = document.getElementById('react-target');
  hydrateRoot(container, <App tasks={ window.__INITIAL_TASKS__ || [] }/>);
});
