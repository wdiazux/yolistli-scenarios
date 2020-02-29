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
                response.data.collision,
                response.data.ground,
                response.data.speed,
                response.data.music,
                response.data.offline,
                () => {
                    console.log(this)
                }
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
