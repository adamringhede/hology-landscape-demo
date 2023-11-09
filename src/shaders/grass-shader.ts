
import { RgbNode, Sampler2DNode, UniformSampler2d, float, mix, colorToNormal, rgb, smoothstep, standardMaterial, textureSampler2d, varyingAttributes, vec3, RgbaNode, rgba, normalize, SimplexNoiseNode, varyingTransformed, lambertMaterial, linearEyeDepth, translateX, timeUniforms, sin, attributes, pow, transformed, rotateAxis } from "@hology/core/shader-nodes";
import { NodeShader, NodeShaderOutput, Parameter, Shader } from "@hology/core/shader/shader";
import { Texture, RepeatWrapping } from "three";

export class GrassShader extends NodeShader {
  @Parameter()
  color: RgbNode

  @Parameter()
  colorTop: RgbNode

  @Parameter()
  maxDistance: number = 140

  @Parameter()
  distanceFade: number = 30


  output(): NodeShaderOutput {

    const gradient = mix(this.color, this.colorTop, varyingAttributes.position.y())
 
    const lit = lambertMaterial({
        color:  gradient
    })
    
    const alpha = mix(float(1), float(0), smoothstep(float(this.maxDistance - this.distanceFade), float(this.maxDistance), linearEyeDepth))
    const rotate = rotateAxis(vec3(0,1,0), new SimplexNoiseNode(transformed.mvPosition.xz()))
    const wind = translateX(sin(timeUniforms.elapsed.multiply(1.4)).multiply(pow(attributes.position.y(), float(2))).multiply(0.2))

    return {
      color: rgba(lit.rgb(), alpha),
      transparent: true,
      //transform: wind
    }
  }
  
}

export default GrassShader
