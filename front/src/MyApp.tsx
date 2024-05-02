import { useRef } from 'react';
import { IRefPhaserGame, PhaserGame } from './game/PhaserGame';
// import {TsikaraFirstLevel} from "./game/scenes/TsikaraFirstLevel";

function MyApp()
{

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

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
        <div id="app">
             <PhaserGame ref={phaserRef} currentActiveScene={currentScene} /> 
            {/*<div>                 */}
            {/*    <button className="button" onClick={changeScene}>Start Game</button>*/}
            {/*</div>*/}
        </div>
    )
}

export default MyApp
