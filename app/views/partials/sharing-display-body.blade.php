@if($form)
<label for="project-share">Sharing Settings</label><br />
<button class="btn btn-default" name="project-share" id="project-share">Share With Other Users</button><br />
@else
<h3>Sharing Settings</h3>
@endif
<!-- <label>Show</label>
<div id="show-results-group" class="btn-group" role="group" aria-label="Show Groups or Users">
    <button type="button" class="show-groups show-results-btn btn btn-primary">Groups</button>
    <button type="button" class="show-users show-results-btn btn btn-default">Users</button>
</div> -->
<label>Order By</label>
<select class="order-results-selector">
    <option value="username">Username</option>
    <option value="firstlast">First, Last Name</option>
    <option value="lastfirst">Last, First Name</option>
    <option value="email">Email</option>
</select>
<div id="shared-users" class="text-align-center">
    <p>This project has not been shared</p>
</div>
@if($form)
<input id="share-settings" name="share-settings" type="hidden" value="" />
@endif
