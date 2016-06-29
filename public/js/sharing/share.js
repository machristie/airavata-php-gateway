/**
 * Utilities for sharing projects and experiments between users
 *
 * @author Jeff Kinnison <jkinniso@nd.edu>
 */

var access_enum = {
	NONE: 0,
	VIEW: 1,
	RUN: 2,
	EDIT: 3,
	ADMIN: 4
};

var dummy_user_data = [
	{
		username: 'testuser1',
		firstname: 'Jane',
		lastname: 'Doe',
		email: 'jadoe@institution.edu',
		access: access_enum.RUN
	},
	{
		username: 'testuser2',
		firstname: 'Ego',
		lastname: 'Id',
		email: 'freud@institution.gov',
		access: access_enum.VIEW
	},
	{
		username: 'testuser3',
		firstname: 'Ivan',
		lastname: 'Ivanov',
		email: 'notkgb@totallynotkgb.ru',
		access: access_enum.NONE
	},
	{
		username: 'testuser4',
		firstname: 'Grok',
		lastname: 'Smytheson',
		email: 'popsicle@prehistoric.com',
		access: access_enum.ADMIN
	},
	{
		username: 'testuser5',
		firstname: 'Identifier',
		lastname: 'Appellation',
		email: 'idapp@institution.edu',
		access: access_enum.EDIT
	}
];

 var createThumbnail = function(username, firstname, lastname, email, access=access_enum.NONE, img="#") {
	 var $thumbnail, data, options;

	 data = {
		 username: username,
		 firstname: firstname,
		 lastname: lastname,
		 email: email,
		 access: access
	 };

	 options = '';
	 options += '<option value="' + access_enum.NONE + '"' + (access === access_enum.NONE ? "selected" : "") + '>Not Shared</option>';
	 options += '<option value="' + access_enum.VIEW + '"' + (access === access_enum.VIEW ? "selected" : "") + '>Can View</option>';
	 options += '<option value="' + access_enum.RUN + '"' + (access === access_enum.RUN ? "selected" : "") + '>Can Run</option>';
	 options += '<option value="' + access_enum.EDIT + '"' + (access === access_enum.EDIT ? "selected" : "") + '>Can Edit</option>';
	 options += '<option value="' + access_enum.ADMIN + '"' + (access === access_enum.ADMIN ? "selected" : "") + '>All Privileges</option>';

	 $thumbnail = $('<div class="sharing-thumbnail col-md-6"> \
	 	<div class="thumbnail"> \
			<button type="button" class="sharing-thumbnail-unshare close" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
			<div class="col-md-4"> \
				<img class="sharing-thumbnail-image" src="' + img + '" alt="' + username + '" /> \
				<h5>' + username + '</h5>\
			</div> \
			<div class="col-md-7"> \
				<h5 class="sharing-thumbnail-name">' + firstname + ' ' + lastname + '</h5> \
				<p class="sharing-thumbnail-email">' + email + '</p> \
				<select class="sharing-thumbnail-access" disabled> \
				' + options + ' \
				</select> \
			</div> \
		</div>');

		$thumbnail.data(data);

		return $thumbnail;
 }

 var usernameComparator = function(a, b) {
 	var $a, $b;
 	$a = $(a).data();
 	$b = $(b).data();

 	if ($a.username < $b.username) {
 		return -1;
 	}
 	else if ($a.username > $b.username) {
 		return 1;
 	}
 	else {
 		return 0;
 	}
 }

var firstLastComparator = function(a, b) {
	var $a, $b;
	$a = $(a).data();
	$b = $(b).data();

	if ($a.firstname < $b.firstname) {
		return -1;
	}
	else if ($a.firstname > $b.firstname) {
		return 1;
	}
	else {
		if ($a.lastname < $b.lastname) {
			return -1;
		}
		else if ($a.lastname > $b.lastname) {
			return 1;
		}
		else {
			return 0;
		}
	}
}

var lastFirstComparator = function(a, b) {
	var $a, $b;
	$a = $(a).data();
	$b = $(b).data();

	if ($a.lastname < $b.lastname) {
		return -1;
	}
	else if ($a.lastname > $b.lastname) {
		return 1;
	}
	else {
		if ($a.firstname < $b.firstname) {
			return -1;
		}
		else if ($a.firstname > $b.firstname) {
			return 1;
		}
		else {
			return 0;
		}
	}
}

var emailComparator = function(a, b) {
	var $a, $b;
	$a = $(a).data();
	$b = $(b).data();

	if ($a.email < $b.email) {
		return -1;
	}
	else if ($a.email > $b.email) {
		return 1;
	}
	else {
		return 0;
	}
}

$(function() {
	var comparator = usernameComparator;

	/* Share box functions */

	/**
	 * Create the popup containing sharing functionality
	 *
	 * @param id The id of the resource being shared
	 * @return The share box JQuery element.
	 */
	var createShareBox = function(resource_id) {
		var $share_box, $user_section, $share_section, $button_section;
		if (($('#share-box')).length === 0) {
			$share_box = $('<div id="share-box" class="modal-fade" tabindex="-1" role="dialog"> \
			    <div class="modal-dialog modal-lg"> \
			        <div class="modal-content"> \
			            <div class="modal-header"> \
			                <button type="button" id="share-box-x" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
			                <h3 class="modal-title">Share this project</h3> \
			            </div> \
			            <div class="modal-body"> \
			                <label>Click on the users you would like to share with.</label> \
			                <input id="share-box-filter" class="form-control" type="text" placeholder="Filter the user list" /> \
							<div id="share-box-options" class="col-md-12"> \
								<label>Show</label> \
								<div id="show-results-group" class="btn-group" role="group" aria-label="Show Groups or Users">\
									<button type="button" id="show-groups" class="show-results-btn btn btn-primary">Groups</button> \
									<button type="button" id="show-users" class="show-results-btn btn btn-default">Users</button> \
								</div> \
								<label>Order By</label> \
								<select id="order-results-selector"> \
									<option value="username">Username</option> \
									<option value="first-last">First, Last Name</option> \
									<option value="last-first">Last, First Name</option> \
									<option value="email">Email</option> \
								</select> \
							</div> \
			                <ul id="share-box-users" class="form-control"></ul> \
			                <label>Set permissions with the drop-down menu on each user, or click the x to cancel sharing.</label> \
							<ul id="share-box-share" class="form-control"></ul> \
			            </div> \
			            <div class="modal-footer"> \
							<button type="button" id="share-box-button" class="btn btn-primary">Save</button> \
			                <button type="button" id="share-box-close" class="btn btn-default" data-dismiss="modal">Cancel</button> \
			            </div> \
			        </div> \
			    </div> \
			</div>');

			if (resource_id) {
				$share_box.data({'resource_id': resource_id});
			}
		}
		return $share_box;
	}

	var createTestData = function () {
		var $users, $share, $user, data;

		$users = $('#share-box-users');
		$share = $('#share-box-share');

		for (var user in dummy_user_data) {
			if (dummy_user_data.hasOwnProperty(user)) {
				data = dummy_user_data[user];
				$user = createThumbnail(data.username, data.firstname, data.lastname, data.email, data.access);
				$user.addClass('user-thumbnail');
				if (data.access === access_enum.NONE) {
					$user.addClass('share-box-users-item');
					$users.append($user);
				}
				else {
					$user.addClass('share-box-share-item');
					$user.find('select').prop("disabled", false);
					$user.find('.sharing-thumbnail-unshare').show();
					$share.append($user);
				}
			}
		}

		$('.user-thumbnail').hide();
	}

	var changeShareState = function($target) {
		// If the user has sharing privileges, revoke them
		if ($target.hasClass('share-box-users-item')) {
			console.log("Sharing");
			$target.find('select').prop("disabled", false);
			$target.find('.sharing-thumbnail-unshare').show();
			$target.detach().prependTo('#share-box-share').show();
		}
		// Otherwise move to the shared list
		else if ($target.hasClass('share-box-share-item')) {
			console.log("Revoking share");
			$target.find('select').val('0');
			$target.find('select').prop("disabled", true);
			$target.find('.sharing-thumbnail-unshare').hide();
			$target.detach().appendTo('#share-box-users');
			$('#share-box-filter').trigger('change');
		}
		$target.toggleClass('share-box-users-item share-box-share-item');
	}





	/* Share box event handlers */

	// Create, populate, and show the share box
	$('body').on('click', 'button#project-share, button#experiment-share', function(e) {
		var $share_list;
		e.stopPropagation();
		e.preventDefault();
		if ($('#share-box').length === 0) {
			$('body').append(createShareBox());
			createTestData();
		}
		else {
			$share_list = $('#shared-users').children();
			$share_list.sort(user_sorter);
			$share_list.each(function(index, element) {
				$(element).detach().appendTo($('#share-box-share'));
			})
		}
		$('#share-box').animate({top: "1%"})
		return false;
	});

	// Filter the list as the user types
	$('body').on('keyup', '#share-box-filter', function(e) {
		var $target, pattern, re, $users;
		e.stopPropagation();
		e.preventDefault();
		$target = $(e.target);
		pattern = $target.val();
		if (pattern && pattern !== '') {
			re = new RegExp('$' + pattern, 'i');
		}
		else {
			re = new RegExp(/.+/);
		}
		$users = $('#share-box-users').children();
		console.log("Users: " + $users);
		$users.each(function(index, element) {
			var data;
			data = $(element).data();
			console.log(data);
			if (re.test(data.username)
			    || re.test(data.firstname)
			    || re.test(data.lastname)
				|| re.test(data.email)
			) {
				console.log("Showing the user");
				$(element).show();
			}
			else {
				console.log("Hiding the user");
				$(element).hide();
			}
		});
		return false;
	});

	$('body').on('click', '.show-results-btn', function(e) {
		var $target;
		e.preventDefault();
		e.stopPropagation();
		$target = $(e.target);
		$other = $target.siblings();
		if ($target.attr('id') === "show-groups" && !$target.hasClass('btn-primary')) {
			$('.group-thumbnail').show();
			$('.user-thumbnail').hide();
			$target.toggleClass('btn-primary btn-default');
			$other.toggleClass('btn-primary btn-default');
		}
		else if ($target.attr('id') === "show-users" && !$target.hasClass('btn-primary')) {
			$('.user-thumbnail').show();
			$('.group-thumbnail').hide();
			$target.toggleClass('btn-primary btn-default');
			$other.toggleClass('btn-primary btn-default');
		}
		return false;
	});

	// Save the sharing permissions of each selected user
	$('body').on('click', '#share-box-button', function(e) {
		var data, resource_id, $share_list;
		e.stopPropagation();
		e.preventDefault();
		data = $("#share-box").data()
		$share_list = $("#share-box-share").children();
		if (data.hasOwnProperty('resource_id')) {
			resource_id = data.resource_id;
			updateUserPrivileges(resource_id, $share_list);
		}
		else {
			if ($share_list.length > 0) {
				$('#shared-users').empty();
				$('#shared-users').removeClass('text-align-center');
				$share_list.sort(user_sorter);
				$share_list.each(function(index, element) {
					$(element).find('shared').prop('detached', true);
					$(element).detach().appendTo($('#shared-users'));
				});
			}
			else {
				$('#shared-users').addClass('text-align-center');
				$('#shared-users').prepend('<p>This project has not been shared</p>');
			}
			$('#share-box').animate({top: '100%'});
		}
		return false;
	});

	// Close the share box
	$('body').on('click', '#share-box-close, #share-box-x', function(e) {
		e.stopPropagation();
		e.preventDefault();
		$('#share-box').animate({top: "100%"});
		return false;
	});

	// Handle sharing and unsharing
	$('body').on('click', '.share-box-users-item, .sharing-thumbnail-unshare', function(e) {
		var $target;
		e.stopPropagation();
		e.preventDefault();
		$target = $(e.target).closest('.sharing-thumbnail');
		changeShareState($target);
		return false;
	});

	$('body').on('click', '.sharing-thumbnail-access', function(e) {
		e.stopPropagation();
		return false;
	});
});
