# Transformation matrices

## Bottom Right
### Code: 

```js 
context.transform(0.5, 0, 0, 0.5, canvas.width * 0.5, canvas.height * 0.5);
```
### Matrix:
```
0.5   0     w * 0.5
0     0.5   h * 0.5
0     0     1
```
## Bottom Left
### Code: 

```js
context.transform(0, 0.5, -0.5, 0, canvas.width * 0.5, canvas.height * 0.5);
```
### Matrix
```
0     -0.5  w * 0.5
0.5   0     h * 0.5
0     0     1
```

## Top Left
### Code: 

```js
context.transform(0, 0.5, 0.5, 0, 0, 0);
```
### Matrix
```
0     0.5   0
0.5   0     0
0     0     1
```
## Top Right
### Code: 

```js
context.transform(0, -0.25, -0.25, 0, canvas.width * 0.75, canvas.height * 0.25);
```
### Matrix
```
0     -0.25 w * 0.75
-0.25 0     h * 0.25
0     0     1
```