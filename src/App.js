import React, { Component } from 'react';
import './App.css';
import Story from './Story.js';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0/';
const TOP_STORIES_URL = "topstories";
const ITEMS_URL = "item/";
const USERS_URL = "user/";
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      itemIds: [],
      stories: [],
      authorsByName: {},
    };
  }

  componentDidMount() {
    console.log("fetching?");
    let fetchedItemIds = null;
    const stories = [];
    const authorsByName = {};
    fetch(`${BASE_URL}${TOP_STORIES_URL}.json`).then(results => {
      return results.json();
    }).then(idsJsonData => {
      console.log({idsJsonData});
      fetchedItemIds = idsJsonData;
      const storyPromises = [];
      for (let i = 0; i < 10; i++) {
        const j = Math.floor(Math.random() * fetchedItemIds.length - i);
        const swapIndex = fetchedItemIds.length - 1 - i;
        const temp = fetchedItemIds[swapIndex];
        fetchedItemIds[swapIndex] = fetchedItemIds[j];
        fetchedItemIds[j] = temp;
        storyPromises.push(fetch(`${BASE_URL}${ITEMS_URL}${fetchedItemIds[swapIndex]}.json`));
      }
      return Promise.all(storyPromises);
    }).then(results => Promise.all(results.map(response => response.json()))
    ).then(storiesJsonData => {
      const userPromises = [];
      for (let story of storiesJsonData) {
        stories.push(story)
        userPromises.push(fetch(`${BASE_URL}${USERS_URL}${story.by}.json`));
      }
      stories.sort((a,b) => a.score - b.score);
      return Promise.all(userPromises);
    }).then(results => Promise.all(results.map(response => response.json()))
    ).then(usersJsonData => {
      for (let user of usersJsonData) {
        authorsByName[user.id] = user;
      }
      console.log({stories,
        authorsByName});
      this.setState({
        stories,
        authorsByName
      });
    });
  }

  renderStories() {
    const {stories, authorsByName} = this.state;
    const ret = stories.map((story, idx) => {
      const author = authorsByName[story.by];
      return <Story 
        key={`story-${idx}`}
        title={story.title} 
        url={story.url}
        timestamp={story.time}
        score={story.score}
        author={story.by}
        karma={author.karma}
      />
    });
    return (
      <div className="Stories">
        {ret}
      </div>
    );
  }

  render() {
    const {stories} = this.state;
    return (
      <div className="App">
        <div className="app-header">Hacker News</div>
        {!!stories.length ? this.renderStories() : "Please wait while we fetch some very good content..."}
      </div>
    );
  }
}

export default App;
