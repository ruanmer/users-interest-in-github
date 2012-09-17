
jQuery(function($){
	var languages = {}, pageCount = 1;

	var checkStarredRepos = function( user, pageNumber ){

		var xhr = $.getJSON('https://api.github.com/users/'+ user +'/starred?page='+ pageNumber +'&callback=?', function ( repos ) {

			$.each( repos.data, function(){

				var lang = this.language;

				if ( languages[ lang ] ){
					languages[ lang ] = languages[ lang ] + 1;
				}
				else {
					languages[ lang ] = 1;
				}
			});

		})
		.success(function( page ){
			/* if has content in next page */
			if ( page.data.length ){
				pageCount++;

				checkStarredRepos( user, pageCount );
			}
			else {
				$('.progress').hide();

				var greater = {
				    lang: null,
				    val: null
				};

				for( var i in languages ){
				    if( languages[i] > greater.val ){
				        greater.lang = i;
				        greater.val = languages[i];
				    }
				}

				// result text
				$('#result').html( '<strong>' + user + '</strong> is more interest in <strong>' + greater.lang + '</strong>. <br>Total of <strong>'+ greater.val +' '+ greater.lang +'</strong> repositories starred.' );
			
				// reset default value
				pageCount = 1;
				languages = {};
			}
		});

	};

	$('#check').on('submit', function(){
		var user = $('#user').val();

		checkStarredRepos( user, 1 );

		$('#result').empty();
		$('.progress').show();

		return false;
	});

});