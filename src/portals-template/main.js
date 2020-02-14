/* eslint-disable no-undef */
const canvas = document.getElementById('renderCanvas')

let engine = null
let scene = null
const createDefaultEngine = function() {
    return new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
    })
}
const createScene = function() {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new BABYLON.Scene(engine)

    const camera = new BABYLON.ArcRotateCamera(
        'Cam_Base',
        0.01,
        0,
        0,
        new BABYLON.Vector3(0.01, 0, 0),
        scene
    )
    camera.setPosition(new BABYLON.Vector3.Zero())
    camera.fov = 1
    camera.lowerRadiusLimit = 0.02
    camera.upperRadiusLimit = 0.01
    scene.activeCamera = camera
    scene.activeCamera.attachControl(canvas)

    const Dome = BABYLON.Mesh.CreateSphere('Dome', 64, 20, scene)

    const envMat = new BABYLON.StandardMaterial('Mat_Dome', scene)
    const envtext = new BABYLON.Texture('textures/equirectangular.jpg', scene)
    envMat.diffuseTexture = envtext
    envMat.diffuseTexture.vScale = -1
    envMat.emissiveTexture = envtext
    envMat.emissiveColor = new BABYLON.Color3(1, 1, 1)
    envMat.backFaceCulling = false
    Dome.material = envMat

    // Create the 3D UI manager
    const manager = new BABYLON.GUI.GUI3DManager(scene)

    // Let's add a button
    const button = new BABYLON.GUI.HolographicButton('down')
    manager.addControl(button)
    button.position = new BABYLON.Vector3(4, 0, -3)
    button.text = 'BACK'
    button.node.rotation.y = 2.2
    button.onPointerUpObservable.add(function() {
        console.log('click')
    })

    scene.debugLayer.show()

    return scene
}

engine = createDefaultEngine()
if (!engine) throw 'engine should not be null.'
scene = createScene()

engine.runRenderLoop(function() {
    if (scene) {
        scene.render()
    }
})

// Resize
window.addEventListener('resize', function() {
    engine.resize()
})
