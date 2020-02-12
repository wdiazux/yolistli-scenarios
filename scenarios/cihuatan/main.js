window.addEventListener('DOMContentLoaded', function() {
    axios.get('settings.json')
    .then(function(response) {
        console.log(Yolistli);
        const yolistli = new Yolistli.Init(
            'renderCanvas',
            response.data.name,
            response.data.location,
            response.data.mode,
            response.data.startPoint,
            response.data.startRotation,
        );

        // Create the scene
        yolistli.createScene();

        // start animation
        yolistli.start();
    })
    .catch(function(error) {
        console.log(error);
    })
});
