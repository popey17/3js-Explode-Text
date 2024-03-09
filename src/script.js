import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import gsap from 'gsap';
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xFFF8DC);

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matCapTexture = textureLoader.load('/textures/matcaps/9.png')

const material = new THREE.MeshMatcapMaterial({
    matcap: matCapTexture
})


//objects
const elements = [];

const fontLoader = new FontLoader();
fontLoader.load(
    '/fonts/helvetiker_bold.typeface.json',
    (font) => {
        const textGeometry1 = new TextGeometry(
            '3Js Test',
            {
                font: font,
                size: 0.6,
                height: 0.4,
                curveSegments:30,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0.00,
                bevelSegments: 10
            }
        )
        const textGeometry2 = new TextGeometry(
            'by Leo',
            {
                font: font,
                size: 0.7,
                height: 0.4,
                curveSegments:15,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0.00,
                bevelSegments: 10
            }
        )
        
        textGeometry1.center();
        textGeometry2.center();
        const text1 = new THREE.Mesh(textGeometry1, material)
        text1.position.y = 0.45
        scene.add(text1)

        const text2 = new THREE.Mesh(textGeometry2, material)
        text2.position.y = -0.45
        scene.add(text2)

        const donutGeometry = new THREE.TorusGeometry(0.5, 0.4, 20, 45);
        const boxGeometry = new THREE.BoxGeometry(0.5 , 0.5 , 0.5);
        const sphereGeometry = new THREE.SphereGeometry(0.5 , 23 , 16 );


        for(let i = 0; i < 70; i++) {
            const size = Math.random() * 0.5 + 0.2;

            const donut = new THREE.Mesh(donutGeometry, material);
            donut.rotation.x = Math.random() * Math.PI;
            donut.scale.set(size, size, size);

            scene.add(donut);
            elements.push(donut);

            const box = new THREE.Mesh(boxGeometry, material);
            box.rotation.x = Math.random() * Math.PI;
            box.scale.set(size, size, size);

            scene.add(box);
            elements.push(box);

            const sphere = new THREE.Mesh(sphereGeometry, material);
            sphere.rotation.x = Math.random() * Math.PI;
            sphere.scale.set(size, size, size);

            scene.add(sphere);
            elements.push(sphere);

        }

        elements.forEach((element) => {
            gsap.to(element.position, {
                x: (Math.random() - 0.5) * 15,
                y: (Math.random() - 0.5) * 15,
                z: (Math.random() - 0.5) * 15,
                duration: 2.5,
                ease: 'linear',
                delay: 0.1
            });
        });
    }
)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.rotation.y = 0.1
camera.position.x = 0.5
camera.position.y = 0
camera.position.z = 3

scene.add(camera)



// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;

});

window.addEventListener('touchmove', (event) => {
    cursor.x = event.touches[0].clientX / sizes.width - 0.5;
    cursor.y = event.touches[0].clientY / sizes.height - 0.5;
});


/**
 * Animate
 */
const clock = new THREE.Clock()
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()    


    console.log(21 - Math.cos(cursor.x * Math.PI) * 20);
    if (isMobile) {
        camera.position.x = Math.sin(cursor.x * Math.PI) * 8;
        camera.position.z = 22 - Math.cos(cursor.x * Math.PI) * 17;
    }else {
        camera.position.x = Math.sin(cursor.x * Math.PI) * 5;
        camera.position.z =  8 - Math.cos(cursor.x * Math.PI) * 5;
    }
    camera.position.y = cursor.y * 10;
    camera.lookAt(scene.position);

    // Update controls
    // controls.update()
    
    // Render
    renderer.render(scene, camera)
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()