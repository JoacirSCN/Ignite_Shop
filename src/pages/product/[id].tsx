import { useRouter } from 'next/router'
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '@/src/styles/pages/product'

export default function Product() {
  const { query } = useRouter()

  return (
    <ProductContainer>
      <ImageContainer></ImageContainer>

      <ProductDetails>
        <h1>nomeDaCamina</h1>
        <span>preço</span>

        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non,
          repellat maiores impedit, laboriosam nihil distinctio vitae eveniet
          beatae blanditiis quod quibusdam dolore nam hic, dignissimos ipsum
          voluptatum. Voluptas, earum sed!
        </p>

        <button>Comprar Agora</button>
      </ProductDetails>
    </ProductContainer>
  )
}
