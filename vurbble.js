//template that lists users from the accounts collection

if(Meteor.isServer){

}

if(Meteor.isClient){
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
});

	Template.users.helpers({
		'user':function(){
			return Meteor.users.find({
        _id:{$ne:Meteor.userId()}
   			});
		},
		'selectedClass':function(){
			var userId = this._id;
			var selectedUser = Session.get('selectedUser');
			if(userId == selectedUser){
				return 'selected';
			}
		},
		'selectedUser':function(){
			var selectedUser = Session.get('selectedUser');
			return Meteor.users.findOne({ _id : selectedUser });
		},
	});
	Template.users.events({
		'click .user' : function(){
			var userId = this._id;
			Session.set('selectedUser', userId);
			var selectedUser = Session.get('selectedUser');
			console.log(selectedUser);
		},	
		'click .newConvo': function(){
			var selectedUser = Session.get('selectedUser');
    		var user = Meteor.users.findOne({ _id : selectedUser });
            var conversation = new Conversation().save();
            conversation.addParticipant(user);
            //log participants:
            conversation.participants().forEach(function(participant){
            console.log(participant.user().username)
        		});
		},
	});	
			
	Template.conversations.helpers({
		'conversation':function(){
			return Meteor.conversations.find();
		},
		'selectedClass':function(){
			var conversationId = this._id;
			var selectedConversation = Session.get('selectedConversation');
			if(conversationId == selectedConversation){
				return 'selected';
			}
		},
		'selectedConversation':function(){
			var selectedConversation = Session.get('selectedConversation');
			return Meteor.conversations.findOne({ _id : selectedConversation });
		},
	});

	Template.conversations.events({
		'click .conversation' : function(){
			var conversationId = this._id;
			Session.set('selectedConversation', conversationId);
			var selectedConversation= Session.get('selectedConversation');
			console.log(selectedConversation);
			//check to see if user is a participant			
			var currentUser = Meteor.userId();
			console.log(currentUser);
			if(!currentUser.isParticipatingIn(selectedConversation)){
				console.log("You are not a participant")
			};
		},	
	});

	Template.messages.helpers({
		'displayMessages':function(){
      		var conversationId= Session.get("selectedConversation");
      		return Meteor.messages.find({
        		conversationId:conversationId});
    	}
	});

	Template.input.events({
	 		'keyup [name=message]' : function (event) {
	    		if (event.which == 13) {
	    			var conversationId = Session.get("selectedConversation");
	    			var conversation = Meteor.conversations.findOne({
	      				_id:Session.get("selectedConversation")});
	      			var text =  $('[name="message"]').val();
	       				if(text !== ''){
	        					conversation.sendMessage(text);
	        					window.scrollTo(0,1600);
	        					console.log("message");	        					
	        				}//if message
	      		$('[name="message"]').val('');
	    		} // if event	    		
	  		} // if keyup

	});
};	