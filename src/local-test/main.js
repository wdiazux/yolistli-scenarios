window.addEventListener('DOMContentLoaded', function() {
    axios
        .get('settings.json')
        .then(function(response) {
            const yolistli = new Yolistli.Init(
                'renderCanvas',
                response.data.name,
                response.data.location,
                response.data.mode,
                response.data.startPoint,
                response.data.startRotation,
                response.data.ground,
                response.data.offline
            )

            // Create the scene
            yolistli.createScene()

            // start animation
            yolistli.start()
        })
        .catch(function(error) {
            console.log(error)
        })
})
