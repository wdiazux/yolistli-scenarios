/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Engine,
    Scene,
    Vector3,
    SceneLoader,
    UniversalCamera,
    StandardMaterial,
    Nullable,
} from 'babylonjs'

export class Init {
    private _canvas: Nullable<HTMLCanvasElement>
    private _engine: Nullable<Engine>
    private _scene: Nullable<Scene>
    private _camera: UniversalCamera
    private _name: string
    private _location: string
    private _mode: string
    private _spoint: number[]
    private _srotation: number[]
    private _collision: boolean
    private _offline: boolean
    private _callback: () => void
    private _sceneChecked: boolean

    constructor(
        canvasElement: string,
        name: string,
        location: string,
        mode?: string,
        startPoint?: number[],
        startRotation?: number[],
        collision?: boolean,
        offline?: boolean,
        callback?: () => void
    ) {
        // Create canvas and engine
        this._canvas = document.getElementById(
            canvasElement
        ) as HTMLCanvasElement
        this._engine = new Engine(this._canvas, true)
        this._name = name
        this._location = location
        this._mode = mode || ''
        this._collision = collision || true
        this._spoint = startPoint || [0, 1.8, 0]
        this._srotation = startRotation || [0, 0, 0]
        this._offline = offline || false
        this._callback = callback
        this._sceneChecked = false
    }

    private loadScene = (callback: () => void): void => {
        const engine = this._engine
        const scene = this._scene

        SceneLoader.ForceFullSceneLoadingForIncremental = true

        engine.resize()

        const defaultCamera = scene.activeCamera

        let dlCount = 0
        SceneLoader.Append(
            this._location + '/',
            this._name + this._mode + '.babylon',
            scene,
            () => {
                scene.executeWhenReady(() => {
                    if (scene.activeCamera) {
                        // re-activate defaultCamera
                        scene.activeCamera = defaultCamera

                        // if camera accepts keys attach them
                        if ((scene.activeCamera as any).keysUp) {
                            ;(scene.activeCamera as any).keysUp.push(90) // Z
                            ;(scene.activeCamera as any).keysUp.push(87) // W
                            ;(scene.activeCamera as any).keysDown.push(83) // S
                            ;(scene.activeCamera as any).keysLeft.push(65) // A
                            ;(scene.activeCamera as any).keysLeft.push(81) // Q
                            ;(scene.activeCamera as any).keysRight.push(69) // E
                            ;(scene.activeCamera as any).keysRight.push(68) // D
                        }
                    }
                    callback()
                })
            },
            evt => {
                if (evt.lengthComputable) {
                    engine.loadingUIText =
                        'Loading, please wait...' +
                        ((evt.loaded * 100) / evt.total).toFixed() +
                        '%'
                } else {
                    dlCount = evt.loaded / (1024 * 1024)
                    engine.loadingUIText =
                        'Loading, please wait...' +
                        Math.floor(dlCount * 100.0) / 100.0 +
                        ' MB already loaded.'
                }
            }
        )
    }

    public createScene = (): void => {
        // create a basic BJS scene object
        this._scene = new Scene(this._engine)

        // default camera for the scene, **this is required**
        this._camera = new UniversalCamera(
            'DefaultCamera',
            new Vector3(this._spoint[0], this._spoint[1], this._spoint[2]),
            this._scene
        )

        // camera default settings
        this._camera.speed = 0.4
        this._camera.inertia = 0.8
        this._camera.fov = 1.024779
        this._camera.maxZ = 500
        this._camera.minZ = 0.05
        this._camera.ellipsoid = new Vector3(0.2, 0.9, 0.2)
        this._camera.checkCollisions = true
        this._camera.applyGravity = true

        // target the camera to scene origin
        this._camera.setTarget(Vector3.Zero())

        // attach the camera to the canvas
        this._camera.attachControl(this._canvas, false)

        // gets or sets a boolean to enable/disable IndexedDB support and avoid XHR on .manifest
        this._engine.enableOfflineSupport = this._offline

        // apply a value to the gravity
        this._scene.gravity = new Vector3(0, -0.5, 0)

        // load scenario
        this.loadScene(() => {
            StandardMaterial.BumpTextureEnabled = true
            if (this._collision) {
                this._scene.collisionsEnabled = this._collision
            }
            if (this._callback) this._callback()
        })
    }

    public start = (): void => {
        if (this._scene) {
            // run the render loop
            this._engine.runRenderLoop(() => {
                this._scene.render()
            })

            // some text for the loading screen
            if (!this._sceneChecked) {
                const remaining = this._scene.getWaitingItemsCount()
                this._engine.loadingUIText =
                    'Streaming items...' +
                    (remaining ? remaining + ' remaining' : '')

                if (remaining === 0) {
                    this._sceneChecked = true
                }
            }

            // the canvas/window resize event handler
            window.addEventListener('resize', () => {
                this._engine.resize()
            })
        }
    }
}
