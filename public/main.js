const remove = document.getElementsByClassName('remove');

Array.from(remove).forEach(function(element) {
      element.addEventListener('click', function(event){
        const toolId = event.target.dataset.toolId
        fetch(`/tool/`, {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            toolId
          })
        }).then(function (response) {
          if (response.ok){
            window.location.reload()
          } else {
            alert('Could not remove item');
          }
        }).catch(function(error) {
        console.error('Delete failed:', error);
        });
      });
});
