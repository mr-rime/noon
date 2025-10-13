import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { useNavigate } from "@tanstack/react-router"
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Package,
    Tag,
    Hash,
    Search,
    Loader2,
    X
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { toast } from "sonner"
import {
    GET_BRANDS,
    CREATE_PSKU_PRODUCT
} from "@/graphql/psku"
import { GET_CATEGORIES } from "@/graphql/category"
import { NestedCategorySelector } from "@/components/category"

interface ProductCreationWizardProps {
    onClose: () => void
}

type Step = 1 | 2 | 3

interface Category {
    category_id: number
    parent_id?: number
    name: string
    slug: string
    description?: string
    level: number
    path: string
    is_active: boolean
    children?: Category[]
    subcategories?: Subcategory[]
}

interface Subcategory {
    subcategory_id: number
    category_id: number
    name: string
    slug: string
    description?: string
    is_active: boolean
}

interface Brand {
    brand_id: number
    name: string
    slug: string
    description?: string
    logo_url?: string
}

export function ProductCreationWizard({ onClose }: ProductCreationWizardProps) {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState<Step>(1)

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [categorySearch, setCategorySearch] = useState("")

    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
    const [brandSearch, setBrandSearch] = useState("")
    const [useGenericBrand, setUseGenericBrand] = useState(false)

    const [psku, setPsku] = useState("")
    const [autoGeneratePsku, setAutoGeneratePsku] = useState(true)

    const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES, {
        variables: { search: categorySearch }
    })

    const { data: brandsData, loading: brandsLoading } = useQuery(GET_BRANDS, {
        variables: { search: brandSearch }
    })

    const [createProduct, { loading: creating }] = useMutation(CREATE_PSKU_PRODUCT)

    const categories = categoriesData?.getCategories?.categories || []
    const brands = brandsData?.getBrands?.brands || []

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep((currentStep + 1) as Step)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((currentStep - 1) as Step)
        }
    }


    const handleCreateProduct = async () => {
        try {
            if (!selectedCategory) {
                toast.error("Please select a category")
                return
            }

            if (!selectedBrand && !useGenericBrand) {
                toast.error("Please select a brand or choose generic")
                return
            }

            if (!autoGeneratePsku && !psku.trim()) {
                toast.error("Please enter a PSKU or enable auto-generation")
                return
            }

            const variables: any = {
                name: `Product in ${selectedCategory.name}`,
                price: 0.01,
                currency: "USD",
                psku: autoGeneratePsku ? undefined : psku.trim(),
                category_id: selectedCategory.category_id,
                stock: 0,
                is_returnable: true,
                is_public: false,
                product_overview: "",
                images: [],
                productSpecifications: [],
                productAttributes: []
            }

            if (!useGenericBrand && selectedBrand?.brand_id) {
                variables.brand_id = selectedBrand.brand_id
            }

            const { data } = await createProduct({ variables })

            if (data?.createProduct?.success) {
                toast.success("Product created successfully!")
                const productId = data.createProduct.product.id
                navigate({ to: `/d/products/$productId`, params: { productId } })
            } else {
                toast.error(data?.createProduct?.message || "Failed to create product")
            }
        } catch (error) {
            console.error("Error creating product:", error)
            toast.error("An error occurred while creating the product")
        }
    }

    const canProceedToStep2 = selectedCategory !== null
    const canProceedToStep3 = selectedBrand !== null || useGenericBrand
    const canCreateProduct = canProceedToStep2 && canProceedToStep3 && (autoGeneratePsku || psku.trim())

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Create New Product</h1>
                    <p className="text-muted-foreground">Follow the 3-step wizard to create your product</p>
                </div>
                <Button variant="ghost" onClick={onClose}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </Button>
            </div>

            <div className="flex items-center justify-center space-x-8">
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                        <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
              ${currentStep >= step
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }
            `}>
                            {currentStep > step ? <Check className="h-5 w-5" /> : step}
                        </div>
                        <div className="ml-3 text-left">
                            <p className={`text-sm font-medium ${currentStep >= step ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                {step === 1 && 'Category Selection'}
                                {step === 2 && 'Brand Selection'}
                                {step === 3 && 'PSKU Setup'}
                            </p>
                        </div>
                        {step < 3 && (
                            <div className={`
                w-16 h-0.5 mx-4
                ${currentStep > step ? 'bg-primary' : 'bg-muted'}
              `} />
                        )}
                    </div>
                ))}
            </div>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {currentStep === 1 && <><Package className="h-5 w-5" /> Step 1: Category Selection</>}
                        {currentStep === 2 && <><Tag className="h-5 w-5" /> Step 2: Brand Selection</>}
                        {currentStep === 3 && <><Hash className="h-5 w-5" /> Step 3: PSKU Setup</>}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="category-search">Search Categories</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="category-search"
                                        placeholder="Search categories..."
                                        value={categorySearch}
                                        onChange={(e) => setCategorySearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {categoriesLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                    Loading categories...
                                </div>
                            ) : (
                                <NestedCategorySelector
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    onCategorySelect={setSelectedCategory}
                                />
                            )}
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="use-generic-brand"
                                    checked={useGenericBrand}
                                    onChange={(e) => {
                                        setUseGenericBrand(e.target.checked)
                                        if (e.target.checked) {
                                            setSelectedBrand(null)
                                        }
                                    }}
                                    className="rounded border-gray-300"
                                />
                                <Label htmlFor="use-generic-brand" className="text-sm">
                                    This product does not have a brand (Generic)
                                </Label>
                            </div>

                            {!useGenericBrand && (
                                <>
                                    <div>
                                        <Label htmlFor="brand-search">Search Brands</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="brand-search"
                                                placeholder="Search brands..."
                                                value={brandSearch}
                                                onChange={(e) => setBrandSearch(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    {brandsLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                            Loading brands...
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {brands.map((brand: Brand) => (
                                                <div
                                                    key={brand.brand_id}
                                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedBrand?.brand_id === brand.brand_id
                                                        ? 'border-primary bg-primary/10'
                                                        : 'hover:border-primary/50'
                                                        }`}
                                                    onClick={() => setSelectedBrand(brand)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="font-semibold">{brand.name}</h3>
                                                            {brand.description && (
                                                                <p className="text-sm text-muted-foreground">{brand.description}</p>
                                                            )}
                                                        </div>
                                                        {selectedBrand?.brand_id === brand.brand_id && (
                                                            <Check className="h-5 w-5 text-primary" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {(selectedBrand || useGenericBrand) && (
                                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                                    <h4 className="font-medium text-primary">Selected Brand:</h4>
                                    <p className="text-sm">
                                        {useGenericBrand ? 'Generic (No Brand)' : selectedBrand?.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="auto-generate-psku"
                                    checked={autoGeneratePsku}
                                    onChange={(e) => setAutoGeneratePsku(e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <Label htmlFor="auto-generate-psku" className="text-sm">
                                    Auto-generate PSKU (recommended)
                                </Label>
                            </div>

                            {!autoGeneratePsku && (
                                <div>
                                    <Label htmlFor="psku">PSKU (Partner SKU)</Label>
                                    <Input
                                        id="psku"
                                        placeholder="Enter unique PSKU identifier"
                                        value={psku}
                                        onChange={(e) => setPsku(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        PSKU should be unique across your products. Use letters, numbers, and hyphens only.
                                    </p>
                                </div>
                            )}

                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h4 className="font-medium mb-2">Product Summary:</h4>
                                <div className="space-y-1 text-sm">
                                    <p><strong>Category:</strong> {selectedCategory?.name}</p>
                                    <p><strong>Brand:</strong> {useGenericBrand ? 'Generic' : selectedBrand?.name}</p>
                                    <p><strong>PSKU:</strong> {autoGeneratePsku ? 'Auto-generated' : psku || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-6">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>

                        <div className="flex gap-2">
                            {currentStep < 3 ? (
                                <Button
                                    onClick={handleNext}
                                    disabled={
                                        (currentStep === 1 && !canProceedToStep2) ||
                                        (currentStep === 2 && !canProceedToStep3)
                                    }
                                >
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleCreateProduct}
                                    disabled={!canCreateProduct || creating}
                                >
                                    {creating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4 mr-2" />
                                            Create Product
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
