/* eslint-disable @typescript-eslint/no-explicit-any */
import 'pepjs'
import {
    Engine,
    Scene,
    Vector3,
    Color3,
    SceneLoader,
    UniversalCamera,
    VirtualJoysticksCamera,
    StandardMaterial,
    WebVRFreeCamera,
    DeviceOrientationCamera,
    Nullable,
    VRExperienceHelper,
    Sound,
    ImageProcessingPostProcess,
} from 'babylonjs'
import 'babylonjs-inspector'
import { UAParser } from 'ua-parser-js'
import createFragment from './tools/createFragments'
import { MDCRipple } from '@material/ripple'
import './styles/style.scss'
import { PBRClearCoatConfiguration } from 'babylonjs/Materials/PBR/pbrClearCoatConfiguration'

type Cameras = Nullable<
    | UniversalCamera
    | VirtualJoysticksCamera
    | DeviceOrientationCamera
    | WebVRFreeCamera
>
export class Init {
    private _canvas: Nullable<HTMLCanvasElement>
    private _engine: Nullable<Engine>
    private _scene: Nullable<Scene>
    private _camera: Cameras
    private _name: string
    private _location: string
    private _mode: string
    private _spoint: number[]
    private _srotation: number[]
    private _collision: boolean
    private _ground: string
    private _speed: number
    private _music: string
    private _offline: boolean
    private _callback: () => void
    private _sceneChecked: boolean
    private _debug: boolean
    private _vrHelper: VRExperienceHelper

    constructor(
        canvasElement: string,
        name: string,
        location: string,
        mode?: string,
        startPoint?: number[],
        startRotation?: number[],
        collision?: boolean,
        ground?: string,
        speed?: number,
        music?: string,
        offline?: boolean,
        callback?: () => void
    ) {
        // Create canvas and engine
        this._canvas = document.getElementById(
            canvasElement
        ) as HTMLCanvasElement
        this._engine = new Engine(this._canvas, true, {
            disableWebGL2Support: true,
        })
        this._name = name
        this._location = location
        this._mode = mode || ''
        this._collision = collision || true
        this._spoint = startPoint || [0, 1.8, 0]
        this._srotation = startRotation || [0, 0, 0]
        this._ground = ground
        this._speed = speed || 1
        this._music = music
        this._offline = offline || false
        this._callback = callback
        this._sceneChecked = false
        this._debug = true
    }

    private loadScene = (callback: () => void) => {
        const engine = this._engine
        const scene = this._scene

        SceneLoader.ForceFullSceneLoadingForIncremental = true

        engine.resize()

        const defaultCamera = scene.activeCamera

        if (this._mode !== '') this._mode = `.${this._mode}`

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

                    scene.gravity = new Vector3(0, -0.3, 0)
                    //scene.fogMode = Scene.FOGMODE_LINEAR
                    scene.environmentIntensity = 0.75
                    scene.fogMode = 3

                    if (this._name === 'cihuatan') {
                        scene.fogColor = new Color3(0, 0.5019607843137255, 1)
                        scene.fogStart = 150
                        const postProcess = new ImageProcessingPostProcess(
                            'processing',
                            1.0,
                            scene.activeCamera
                        )
                        postProcess.contrast = 1.2
                        postProcess.exposure = 0.9
                        postProcess.toneMappingEnabled = true
                        postProcess.vignetteWeight = 1.3
                        postProcess.vignetteCameraFov = 0.6

                        scene.getMeshByID('hdrSkyBox').position = new Vector3(
                            0,
                            -15,
                            0
                        )
                        scene.getMeshByID('hdrSkyBox').scaling = new Vector3(
                            2.5,
                            2.5,
                            2.5
                        )
                    }

                    if (this._music && this._music !== '') {
                        const music = new Sound(
                            'MusicBackground',
                            this._location + '/' + this._music,
                            scene,
                            null,
                            { loop: true, autoplay: true, volume: 0.4 }
                        )
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
        this._camera.rotation = new Vector3(
            this._srotation[0],
            this._srotation[1],
            this._srotation[2]
        )
        this._camera.speed = this._speed
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
        this._scene.gravity = new Vector3(0, -0.3, 0)

        // load scenario
        this.loadScene(() => {
            StandardMaterial.BumpTextureEnabled = true
            if (this._collision) {
                this._scene.collisionsEnabled = this._collision
            }

            // show panel
            const panel = document.querySelector('#panel')
            if (panel) panel.classList.add('visible')

            // show debug btn
            const debugBtn: HTMLButtonElement = document.querySelector(
                '#debug-btn'
            )
            if (debugBtn && this._debug) {
                debugBtn.style.opacity = '1'
            } else {
                debugBtn.parentNode.removeChild(debugBtn)
            }

            const overlay: HTMLDivElement = document.querySelector(
                '#scene-overlay'
            )
            if (overlay) {
                overlay.style.opacity = '1'
                overlay.style.visibility = 'visible'
            }

            if (this._callback) this._callback()
        })
    }

    public start = (): void => {
        if (this._scene) {
            // run the render loop
            this._engine.runRenderLoop(() => {
                this._engine.performanceMonitor.enable()
                this._scene.render()
            })

            // some text for the loading screen
            if (!this._sceneChecked) {
                const remaining = this._scene.getWaitingItemsCount()
                this._engine.loadingUIText =
                    'Streaming items...' +
                    (remaining ? remaining + ' remaining' : '')

                if (remaining === 0) this._sceneChecked = true
            }

            // create panel with option buttons for camera
            this.createPanel()

            // create overlay
            this.createOverlay()

            // delete loader
            this.removeLoader()

            // create vrHelper
            this.createVRHelper()

            // the canvas/window resize event handler
            window.addEventListener('resize', () => {
                this._engine.resize()
            })
        }
    }

    private hideCameraPanel = (): void => {
        const panel = document.querySelector('#panel')
        if (panel) panel.classList.remove('visible')
    }

    private switchCamera = (camera: Cameras) => {
        const activeCamera = this._scene.activeCamera as any
        if ('rotation' in activeCamera) {
            camera.rotation = activeCamera.rotation.clone()
        }
        camera.fov = activeCamera.fov
        camera.minZ = activeCamera.minZ
        camera.maxZ = activeCamera.maxZ

        if ('ellipsoid' in this._scene.activeCamera) {
            camera.ellipsoid = (this._scene
                .activeCamera as any).ellipsoid.clone()
        }
        camera.checkCollisions = (this._scene
            .activeCamera as any).checkCollisions
        camera.applyGravity = activeCamera.applyGravity

        camera.speed = activeCamera.speed

        activeCamera.detachControl(this._canvas)
        if (this._scene.activeCamera.dispose) activeCamera.dispose()

        this._scene.activeCamera = camera

        this._scene.activeCamera.attachControl(this._canvas)
    }

    private removeLoader = () => {
        const loaderContainer = document.querySelector('.loader-container')
        if (!loaderContainer) return

        loaderContainer.parentNode.removeChild(loaderContainer)
    }

    private createOverlay = () => {
        const container = this._canvas.parentNode
        const overlay = document.createElement('div')
        overlay.id = 'scene-overlay'
        overlay.innerHTML = `<div class="scenario-title">${this._name}</div>`
        if (container) {
            container.append(overlay)
        }
    }

    private hideOverlay = () => {
        const overlay: HTMLElement = document.querySelector('#scene-overlay')
        if (overlay) overlay.style.display = 'none'
    }

    private createVRHelper = () => {
        if (
            this._vrHelper &&
            (this._scene.activeCamera instanceof WebVRFreeCamera ||
                this._scene.activeCamera instanceof DeviceOrientationCamera)
        ) {
            return
        }

        const button = document.querySelector('#vr-btn') as HTMLButtonElement

        if (button) {
            this._vrHelper = this._scene.createDefaultVRExperience({
                useCustomVRButton: true,
                customVRButton: button,
                createDeviceOrientationCamera: false,
                createFallbackVRDeviceOrientationFreeCamera: true,
                useMultiview: true,
            })
        }
    }

    private createPanel = () => {
        const container = this._canvas.parentNode

        // detect device and browser
        const uaParser = new UAParser()
        const isMobile =
            uaParser.getDevice().type === 'mobile' ||
            uaParser.getDevice().type === 'tablet'

        const buttonElements: DocumentFragment = createFragment({
            id: 'panel',
            element: 'div',
            htmlStr: `
            <button id="desk-btn" class="mdc-button mdc-fab--extended mdc-button--raised">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">
                    <i class="far fa-desktop-alt"></i> Desktop Environment
                </span>
            </button>
            <button id="mob-btn" class="mdc-button mdc-fab--extended mdc-button--raised">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">
                    <i class="far fa-mobile-alt"></i> Mobile Environment
                </span>
            </button>
            <button id="vr-btn" class="mdc-button mdc-fab--extended mdc-button--raised">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">
                    <i class="far fa-vr-cardboard"></i> VR Environment
                </span>
            </button>
        `,
        })

        const settingBtn: DocumentFragment = createFragment({
            id: 'debug-btn',
            element: 'button',
            classElm: 'mdc-button mdc-fab--extended mdc-button--raised',
            htmlStr: `<div class="mdc-button__ripple"></div>
            <span class="mdc-button__lable"><i class="far fa-cogs"></i></span>`,
        })

        // add buttons to the canvas container
        container.append(buttonElements)
        container.append(settingBtn)

        // ripple effect aka material.io for all buttons
        const buttons = document.querySelectorAll('.mdc-button')
        buttons.forEach(elm => {
            MDCRipple.attachTo(elm)
        })

        // declare buttons
        const deskBtn: HTMLButtonElement = document.querySelector('#desk-btn')
        const mobBtn: HTMLButtonElement = document.querySelector('#mob-btn')
        const vrBtn: HTMLButtonElement = document.querySelector('#vr-btn')
        const debugBtn: HTMLButtonElement = document.querySelector('#debug-btn')

        if (isMobile) {
            deskBtn.style.display = 'none'
            debugBtn.style.display = 'none'
        } else {
            mobBtn.style.display = 'none'
        }

        // listeners for buttons
        // ---------------------

        // desktop button camera
        deskBtn.addEventListener('click', () => {
            if (!this._scene) return

            if (this._scene.activeCamera instanceof UniversalCamera) {
                this.hideOverlay()
                this.hideCameraPanel()
                return
            }

            const camera = new UniversalCamera(
                'universalCamera',
                this._scene.activeCamera.position,
                this._scene
            )

            this.hideOverlay()
            this.hideCameraPanel()
            this.switchCamera(camera)
        })

        // mobile button camera
        mobBtn.addEventListener('click', () => {
            if (!this._scene) return

            if (this._scene.activeCamera instanceof VirtualJoysticksCamera) {
                return
            }

            const camera = new VirtualJoysticksCamera(
                'virtualJoysticksCamera',
                this._scene.activeCamera.position,
                this._scene
            )

            this.hideOverlay()
            this.hideCameraPanel()
            this.switchCamera(camera)
        })

        // VR button camera
        vrBtn.addEventListener('click', () => {
            if (!this._scene || !this._vrHelper) return

            this._vrHelper.enterVR()

            console.log(this._ground)
            this._vrHelper.onAfterEnteringVRObservable.add(() => {
                if (
                    this._scene.activeCamera === this._vrHelper.webVRCamera &&
                    this._ground
                ) {
                    this._vrHelper.enableTeleportation({
                        floorMeshName: this._ground,
                    })
                }
            })

            this.hideOverlay()
            this.hideCameraPanel()
        })

        // open debug mode
        document.querySelector('#debug-btn').addEventListener('click', () => {
            if (this._scene) {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide()
                } else {
                    this._scene.debugLayer.show()
                }
            }
        })
    }
}
