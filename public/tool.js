const saveEdits = document.querySelector('.save').addEventListener('click', (event) => {
    const toolBorrow = document.getElementById('toolBorrow').value
    const date = document.getElementById('date').value
    const toolId = event.target.dataset.toolId //we get this from the data attribute in profile.ejs. Easier if named something random! profile.ejs: ln37
    console.log(toolId)
    console.log(date)
    fetch(`/tool/${toolId}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            toolId,
            'borrower': toolBorrow,
            'returnDate': date
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.href = '/profile'
        })
})

