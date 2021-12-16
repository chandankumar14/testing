
function changeSelectorHandler(_this){
  const selectedVal = $(_this).val();
  $(_this).parent().siblings('.content').children('.tab-content').hide();  
  $(_this).parent().siblings('.content').children('.tab-'+selectedVal).show();
 
}