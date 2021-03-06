'use strict';

var McFly             = require('../utils/mcfly')
var Actions           = require('../actions/actionCreators')

var PlaylistStore     = require('../stores/playlistStore')
var CurrentTrackStore = require('../stores/currentTrackStore')

var _                 = require('lodash')

var _loaded      = false
var _favorites   = []

function _setFavorites(tracks) {
  _favorites = tracks
}

var LikesStore = McFly.createStore({

  getLikes: function() {
    return _favorites
  },

  loaded: function() {
    return _loaded
  },

}, function(payload) {

  switch (payload.actionType) {

    case 'LOADED_COLLECTION':
      _loaded = true
      _setFavorites(payload.collection)

      if (PlaylistStore.getPlaylist().length === 0 || !CurrentTrackStore.getAudio().src)
        Actions.setPlaylist(payload.collection)

      break

    case 'LIKE_TRACK':
      // we don't want duplicate tracks to end up in the LikesView
      if (_loaded && !_.detect(_favorites, { 'id' : payload.track.id }))
        _favorites.unshift(payload.track)
      break

    case 'UNLIKE_TRACK':
      if (_loaded)
        _.remove(_favorites, { 'id' : payload.track.id })
      break
  }

  LikesStore.emitChange()

  return true
});

module.exports = LikesStore
