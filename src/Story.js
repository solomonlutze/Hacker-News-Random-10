import React, { Component } from 'react';
import PropTypes from 'prop-types';
class Story extends Component {
    render() {
        const {title, url, timestamp, score, author, karma} = this.props;
        return (
            <div className='Story'>
                <div className='title'>{title}</div>
                <div className='author'><span className='label'>By: </span>{author}<span className='karma'><span className='karma'> (Karma: {karma}</span></span>)</div>
                <div className='timestamp'><span className='label'>Published: </span>{timestamp}</div>
                <div className='score'><span className='label'>Score: </span>{score}</div>
                
                {!!url ? 
                    <div className='url'><span className='label'>URL: </span><a href={url}>{url}</a></div>
                    : null
                }
            </div>
        );
    }


}

Story.propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string,   // Not every story has a URL, apparently
    timestamp: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    author: PropTypes.string.isRequired,
    karma: PropTypes.number.isRequired
}

export default Story;