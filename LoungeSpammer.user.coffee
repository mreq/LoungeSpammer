# ==UserScript==
# @name        LoungeSpammer
# @namespace   LoungeSpammer
# @author      mreq http://github.com/mreq
# @include     http://csgolounge.com/mybets
# @include     http://dota2lounge.com/mybets
# @include     http://csgolounge.com/match
# @include     http://dota2lounge.com/match
# @version     0.0.1
# @downloadURL http://cdn.mreq.eu/LoungeSpammer.user.js
# @updateURL   http://cdn.mreq.eu/LoungeSpammer.user.js
# @grant       none
# ==/UserScript==

class Spammer
	constructor: ->
		@createBox()
		@overwriteAlert()
		@addButton()
	createBox: ->
		@box = $('<section class="box"><div class="title">Status</div><article class="standard" style="margin-top:50px;" id="loungespammer"></article></section>')
		$('#main > .box').first().after @box
		@content = @box.find('#loungespammer')
	overwriteAlert: ->
		@i = 0
		window.alert = (c) =>
			@content.text "#{ @i }: #{ c }"
	startSpamming: ->
		setInterval (=> @i++; @spamLounge()), 1500
	addButton: ->
		@spamButton.one 'click', @startSpamming
	spamLounge: ->

class BetSpammer extends Spammer
	spamLounge: postToFreezeReturn
	addButton: ->
		@spamButton = $('<a class="button" id="loungespammer-button">Spam place bet</a>')
		$('#freezebutton').after @spamButton
		super

class ReturnsSpammer extends Spammer
	constructor: ->
		@button = $('#placebut')
		super
	spamLounge: ->
		@button.click()
	addButton: ->
		@spamButton = $('<a class="button" id="loungespammer-button">Spam request returns</a>')
		$('#freezebutton').after @spamButton
		super


init = ->


$ init