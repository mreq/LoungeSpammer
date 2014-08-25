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
	url = window.location.href
	if url.match 'mybets' isnt null
		new ReturnsSpammer
	else if url.match 'match' isnt null
		new BetSpammer

$ -> init()