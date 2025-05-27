import React from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { TasksCollection } from "/imports/api/tasks";
import { Tag } from "./Tag";

export const App = ({ tasks = [] }) => {
    if (tasks.length == 0) {
        useSubscribe("tasks");
        tasks = useTracker(() => TasksCollection.find().fetch());
    }

    return (
        <div>
            <h1>Welcome to Meteor!</h1>
            <ul>
                { tasks.map(task => <li key={ task._id }>{task.text}{' '}<Tag text={task.tag}></Tag></li>) }
            </ul>
            <Hello/>

        </div>
    );

};
