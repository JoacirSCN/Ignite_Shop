import { GetStaticProps } from 'next'
import Image from 'next/image'

import { stripe } from '../lib/stripe'
import { HomeContainer, Product, SliderContainer } from '../styles/pages/home'

import Stripe from 'stripe'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Head from 'next/head'
import { CartButton } from '../components/CartButton'
import { useCart } from '../hooks/useCart'
import { IProduct } from '../contexts/CartContext'
import { MouseEvent, useEffect, useState } from 'react'
import { ProductSkeleton } from '../components/ProductSkeleton'

interface HomeProps {
  products: IProduct[]
}

export default function Home({ products }: HomeProps) {
  const [isLoading, setIsLoading] = useState(true)

  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    skipSnaps: false,
    dragFree: true,
  })

  useEffect(() => {
    // fake loading to use the skeleton loading from figma
    const timeOut = setTimeout(() => setIsLoading(false), 2000)

    return () => clearTimeout(timeOut)
  }, [])

  const { addToCart, checkIfItemAlreadyExists } = useCart()

  function handleAddToCart(
    e: MouseEvent<HTMLButtonElement>,
    product: IProduct,
  ) {
    e.preventDefault()
    addToCart(product)
  }

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      <div style={{ overflow: 'hidden', width: '100%' }}>
        <HomeContainer>
          <div className="embla" ref={emblaRef}>
            <SliderContainer className="embla__container">
              {isLoading ? (
                <>
                  <ProductSkeleton className="embla_slide" />
                  <ProductSkeleton className="embla_slide" />
                  <ProductSkeleton className="embla_slide" />
                </>
              ) : (
                <>
                  {products.map((product: any) => {
                    return (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        prefetch={false}
                      >
                        <Product className="embla__slide">
                          <Image
                            src={product.imageUrl}
                            width={520}
                            height={480}
                            alt=""
                          />

                          <footer>
                            <div>
                              <strong>{product.name}</strong>
                              <span>{product.price}</span>
                            </div>
                            <CartButton
                              color="green"
                              size="large"
                              disabled={checkIfItemAlreadyExists(product.id)}
                              onClick={(e) => handleAddToCart(e, product)}
                            />
                          </footer>
                        </Product>
                      </Link>
                    )
                  })}
                </>
              )}
            </SliderContainer>
          </div>
        </HomeContainer>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  })

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Number(price.unit_amount) / 100),
      numberPrice: Number(price.unit_amount) / 100,
      defaultPriceId: price.id,
    }
  })

  return {
    props: {
      products,
    },

    revalidate: 60 * 60 * 2, // 2 hours
  }
}
