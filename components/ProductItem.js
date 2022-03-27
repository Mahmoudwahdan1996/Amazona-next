import Link from "next/link";
import Image from "next/image";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";

const ProductItem = ({ product, addToCartHandler }) => {
  return (
    <Card>
      <Link href={`/product/${product.slug}`} passHref>
        <CardActionArea>
          <CardMedia>
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              layout="responsive"
            />
          </CardMedia>
          <CardContent>
            <Typography>{product.name}</Typography>
            <Rating value={product.rating} readOnly></Rating>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions>
        <Typography>${product.price}</Typography>
        <Button
          size="small"
          color="primary"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductItem;
