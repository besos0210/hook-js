    let height = 660; // 固定的高度值
    let width = 1366; // 固定的宽度值

    let innerHeight_property_accessor = Object.getOwnPropertyDescriptor(window, "innerHeight"); // 获取innerHeight属性访问器描述符
    let innerHeight_set_accessor = innerHeight_property_accessor.set; // 获取setter

    Object.defineProperty(window, "innerHeight", {
        get: function () {
            // 在这里写你想让hook后的属性在被获取值时执行的代码
            return height;
        },
        set: function () {
            // 在这里写你想让hook后的属性在被设置值时执行的代码
            innerHeight_set_accessor.call(window, height);// 将网站js设置目标属性值时所传入的内容传给原setter设置并返回结果
        }
    });

    let innerWidth_property_accessor = Object.getOwnPropertyDescriptor(window, "innerWidth"); // 获取innerWidth属性访问器描述符
    let innerWidth_set_accessor = innerWidth_property_accessor.set; // 获取setter

    Object.defineProperty(window, "innerWidth", {
        get: function () {
            // 在这里写你想让hook后的属性在被获取值时执行的代码
            return width;
        },
        set: function () {
            // 在这里写你想让hook后的属性在被设置值时执行的代码
            innerWidth_set_accessor.call(window, width);// 将网站js设置目标属性值时所传入的内容传给原setter设置并返回结果
        }
    });
