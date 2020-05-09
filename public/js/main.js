//console.log("Hello Suleiman");

$(document).ready(function(){
	$('.delete-recyclings').on('click', function(e){
		 var con = confirm("Are you sure you want to delete this Record?");
	    if(con != true){
	        return false;
	    }else{
	    	$target = $(e.target);
			//console.log($target.attr('data-id'));
			const id = $target.attr('data-id');
			$.ajax({
				type:'DELETE',
				url: '/recyclings/'+id,
				success: function(response){
					window.location.href='/recyclings/ManageRecyclings/';
				},
				error: function(err){
					console.log(err);
				} 

			});
		}

	});
});