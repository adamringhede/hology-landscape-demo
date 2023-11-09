import 'reflect-metadata'
import './App.css';
import { initiateGame, inject, PhysicsSystem, Service, ViewController, World } from '@hology/core/gameplay';
import { createRef, useEffect } from 'react';
import shaders from './shaders'
import actors from './actors'

function App() {
  const containerRef = createRef<HTMLDivElement>()
  useEffect(() => {
    initiateGame(Game, {
      element: containerRef.current as HTMLElement, 
      sceneName: 'demo', 
      dataDir: 'data', 
      shaders,
      actors
    })
  }, [containerRef])
  return (
    <div className="App">
      <div ref={containerRef}></div>
    </div>
  );
}

export default App;


@Service()
class Game {
  private world = inject(World)
  private viewController = inject(ViewController)
  private physics = inject(PhysicsSystem)

  constructor() {

  }
}