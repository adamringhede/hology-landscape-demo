
import { RgbNode, Sampler2DNode, UniformSampler2d, float, mix, colorToNormal, rgb, smoothstep, standardMaterial, textureSampler2d, varyingAttributes, vec3, RgbaNode, rgba, normalize, SimplexNoiseNode, varyingTransformed } from "@hology/core/shader-nodes";
import { NodeShader, NodeShaderOutput, Parameter, Shader } from "@hology/core/shader/shader";
import { Texture, RepeatWrapping } from "three";

export class ExampleShader extends NodeShader {
  @Parameter()
  color: RgbNode

  @Parameter()
  grassTexture: Texture

  @Parameter()
  dirtTexture: Texture

  @Parameter()
  dirtNormalTexture: Texture

  @Parameter()
  threshold: number = 0.5

  @Parameter()
  gradient: number = 0.1

  output(): NodeShaderOutput {
    // TODO The if statements shouldn't be necessary.
    // Either let it be runtime errors or don't allow saving
    if (this.grassTexture) {
      this.grassTexture.wrapS = this.grassTexture.wrapT = RepeatWrapping
    }
    if (this.dirtTexture) {
      this.dirtTexture.wrapS = this.dirtTexture.wrapT = RepeatWrapping
    }
    if (this.dirtNormalTexture) {
      this.dirtNormalTexture.wrapS = this.dirtNormalTexture.wrapT = RepeatWrapping
    }


    const dirtUv = varyingAttributes.uv.multiplyScalar(2)

    const grassColor = textureSampler2d(this.grassTexture).sample(varyingAttributes.uv.multiplyScalar(25))
    const dirtColor = textureSampler2d(this.dirtTexture).sample(dirtUv)
    const dirtNormalSample = textureSampler2d(this.dirtNormalTexture).sample(dirtUv)
    const dirtNormal = colorToNormal(dirtNormalSample, 1)

    // I think that maybe using multiple standard materials increases the number of varyings being used. 
    // Maybe there is a way to reduce the number of varyings
    //const grassMaterial = standardMaterial({color: mix(grassColor.rgb(), this.color, float(0.8))})
    //const rockMaterial = standardMaterial({color: dirtColor.rgb(), normal: dirtNormal })

    const worldSpaceNormal = normalize(dirtNormalSample.xyz().multiplyScalar(2).add(varyingAttributes.normal))


    const noiseScale = 2
    const noiseWidth = 0.01
    const slopeMixAlpha = smoothstep(
      float(this.threshold - this.gradient / 2), float(this.threshold + this.gradient / 2), 
      varyingAttributes.normal.y().add( new SimplexNoiseNode(varyingAttributes.position.xz().multiplyScalar(noiseScale)).multiply(noiseWidth)))


    return {
//      color: standardMaterial({color: vec3(varyingAttributes.uv.x(), varyingAttributes.uv.y(), float(0)).rgb()}),
      color: standardMaterial({
        color:  mix(dirtColor.rgb(), mix(grassColor.rgb(), this.color, float(0.8)), slopeMixAlpha), 
        normal: mix(dirtNormal, varyingTransformed.normal, slopeMixAlpha) 
      }) 
      
     
      //color: standardMaterial({ color: colorToNormal(textureSampler2d(this.dirtNormalTexture).sample(dirtUv), float(1)).rgb() })
      //color: rockMaterial
      //color: rgba(vec3(worldSpaceNormal.y(), worldSpaceNormal.y(), worldSpaceNormal.y()), 1)
    }
  }
}

export default ExampleShader
