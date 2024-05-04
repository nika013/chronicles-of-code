import { useRef } from 'react';
import { IRefPhaserGame, PhaserGame } from '../game/PhaserGame.tsx';
import './playground.css';

function Playground()
{

    //    References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    //
    // const changeScene = () => {
    //
    //     if(phaserRef.current)
    //     {
    //         const scene = phaserRef.current.scene as TsikaraFirstLevel;
    //
    //         if (scene)
    //         {
    //             scene.changeScene();
    //         }
    //     }
    // }
    //
    //
    // Event emitted from the PhaserGame component
    // const currentScene = (scene: Phaser.Scene) => {
    //     console.log(scene)
    // }
    //ferences to the PhaserGame component (game and scene are exposed)
    //const phaserRef = useRef<IRefPhaserGame | null>(null);

    // const changeScene = () => {
    //
    //     if(phaserRef.current)
    //     {     
    //         const scene = phaserRef.current.scene as TsikaraFirstLevel;
    //
    //         if (scene)
    //         {
    //             scene.changeScene();
    //         }
    //     }
    // }


    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        console.log(scene)
    }

    return (
        <div className="playground">
            <div className="phaserGameContainer">
                {/*<p>game should appear here</p>*/}

                <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            </div>

            {/*<div className="editorContainer">*/}
            {/*    <GeorgianCodeEditor/>*/}
            {/*</div>*/}
        </div>
    )
}


export default Playground
